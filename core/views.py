from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError

from .models import *
from .serializers import *
from .permissions import *


def get_course(self):
    # Get the course_slug from the URL and fetch the course
    course_slug = self.kwargs.get('course_slug')
    course = get_object_or_404(Course, slug=course_slug)
    return course


class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'user__username'
    
    def perform_create(self, serializer):
        user = self.request.user
        if Instructor.objects.filter(user=user).exists():
            # User is already an instructor, raise a validation error
            raise ValidationError({"error": "Bad Attempt"})
        else:
            serializer.save(user=user)

    def get_permissions(self):
        if self.action in ['list']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    def perform_create(self, serializer):     
        course = get_course(self)   
        
        # Check if the student is already enrolled in the course
        if Enrollment.objects.filter(course=course, student=self.request.user).exists():
            raise ValidationError({"detail": "You are already enrolled in this course."})
        else:
            # Save the enrollment with the course and student
            serializer.save(course=course, student=self.request.user)
            raise ValidationError("Enrolled Successfully!")

    def get_permissions(self):
        if self.action in ['retrieve', 'list' ,' update', 'delete']:
            return [permissions.IsAdminUser()]
        if self.action in  ['create']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [CoursesPermission]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()
        # If the user is an instructor, only return courses associated with that instructor
        if self.request.user.is_authenticated and hasattr(self.request.user, 'instructor'):
            if queryset.filter(instructor=self.request.user.instructor).exists():
                return queryset.filter(instructor=self.request.user.instructor)
            else:
                return []
        
        # For unauthenticated or non-instructor users, return an empty queryset
        return queryset
    
    def perform_create(self, serializer):
        title = self.request.data.get('title')
        instructor = self.request.user.instructor
        existing_course = Course.objects.filter(title=title,instructor = instructor).first()
        if existing_course:
            raise ValidationError({"error": "A course of yours with this title already exists."})
        else:
            serializer.save(instructor=self.request.user.instructor)

    def perform_update(self, serializer):
        title = self.request.data.get('title')
        instructor = self.request.user.instructor
        instance = self.get_object()
        existing_course = Course.objects.filter(title=title,instructor = instructor).exclude(pk=instance.pk).first()
        if existing_course:
            raise ValidationError({"error": "A course with this title already exists."})
        else:
            serializer.save()

    def get_permissions(self):
        if self.action in ['retrieve']:
            return [permissions.AllowAny()]
        return super().get_permissions()


class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [ContentPermission]
    lookup_field = 'slug'

    def perform_create(self, serializer):
        course = get_course(self)
        serializer.save(course=course)


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [MessagesPermission]

    def get_queryset(self):
        course= get_course(self)

        # Fetch messages related to the course and the current user (sender or receiver)
        return Message.objects.filter(course=course, sender=self.request.user) | Message.objects.filter(course=course, receiver=self.request.user)

    def perform_create(self, serializer):
        course= get_course(self)
        receiver_username = self.request.data['receiver']
        receiver = User.objects.get(username=receiver_username)

        if receiver == course.instructor.user and receiver != self.request.user:
            serializer.save(sender=self.request.user, course=course, receiver=receiver)
        else:
            raise ValidationError("You can only send messages to your enrolled instructors.")


class AssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssessmentSerializer
    permission_classes = [ContentPermission]
    lookup_field = 'title'

    def get_queryset(self):
        content_slug = self.kwargs.get('content_slug')
        content = get_object_or_404(Content, slug=content_slug)
        queryset = Assessment.objects.filter(content=content)
        return queryset

    def perform_create(self, serializer):
        content_slug = self.kwargs.get('content_slug')
        content = get_object_or_404(Content, slug=content_slug)
        serializer.save(content=content)


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [ContentPermission]
    
    def get_queryset(self):
        course_slug = self.kwargs.get('course_slug')
        assessment_pk = self.kwargs.get('assessment_pk')
        
        queryset = Question.objects.filter(
                assessment__content__course__slug=course_slug,
                assessment_id=assessment_pk
            ) 
        return queryset

    def perform_create(self, serializer):
        # Set the assessment based on the assessment_id in the URL
        assessment_id = self.kwargs.get('assessment_pk')
        assessment = Assessment.objects.get(pk=assessment_id)
        serializer.save(assessment=assessment)


class OptionViewSet(viewsets.ModelViewSet):
    serializer_class  = OptionSerializer
    permissions_class = [ContentPermission]

    def get_queryset(self):
        course_slug = self.kwargs.get('course_slug')
        assessment_pk = self.kwargs.get('assessment_pk')
        question_pk = self.kwargs.get('question_pk')

        queryset = Option.objects.filter(
                question__assessment__content__course__slug=course_slug,
                question__assessment_id=assessment_pk,
                question_id=question_pk
            )

        return queryset
    def perform_create(self, serializer):
        question_pk = self.kwargs.get('question_pk')
        question = get_object_or_404(Question, pk=question_pk)

        existing_options_count = Option.objects.filter(question=question).count()
        option_text = serializer.validated_data.get('option_text')
        existing_options_with_same_text = Option.objects.filter(question=question, option_text=option_text)
        is_correct = serializer.validated_data.get('is_correct')

        # Validate only one correct answer
        if existing_options_count >= 4:
            raise ValidationError("Cannot create more than 4 options for a question.")

        # Validate option text uniqueness
        elif existing_options_with_same_text.exists():
            raise ValidationError("This option already exists.")

        # Validate the number of options
        elif  is_correct:
            existing_correct_option = Option.objects.filter(question=question, is_correct=True)
            if existing_correct_option.exists():
                raise ValidationError("Correct answer already exists.")

        else:
            serializer.save(question=question)

    def perform_update(self, serializer):
        question_pk = self.kwargs.get('question_pk')
        question = get_object_or_404(Question, pk=question_pk)

        is_correct = serializer.validated_data.get('is_correct')

        # Validate the number of options
        if  is_correct:
            existing_correct_option = Option.objects.filter(question=question, is_correct=True)
            if existing_correct_option.exists():
                raise ValidationError("Correct answer already exists.")

        else:
            serializer.save(question=question)
            