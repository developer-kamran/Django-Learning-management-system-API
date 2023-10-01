from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'instructors', InstructorViewSet, basename="instructors")
router.register(r'courses', CourseViewSet, basename='courses')
router.register(r'(?P<course_slug>[-\w]+)/enrollments', EnrollmentViewSet,basename='enrollment')
router.register(r'(?P<course_slug>[-\w]+)/lessons', ContentViewSet, basename='lessons')
router.register(r'(?P<course_slug>[-\w]+)/assessments/(?P<content_slug>[-\w]+)', AssessmentViewSet, basename='assessments')
router.register(r'(?P<course_slug>[-\w]+)/assessment-(?P<assessment_pk>\d+)/questions', QuestionViewSet, basename= "questions")
router.register(r'(?P<course_slug>[-\w]+)/assessment-(?P<assessment_pk>\d+)/question-(?P<question_pk>\d+)/options', OptionViewSet, basename= "options")
router.register(r'(?P<course_slug>[-\w]+)/messages', MessageViewSet, basename='messages')

urlpatterns = [
    path('', include(router.urls)),
]
