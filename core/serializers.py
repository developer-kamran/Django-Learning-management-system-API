from rest_framework import serializers
from .models import *


class InstructorSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Instructor
        fields = ['user', 'bio']

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'enrollment_date']
        read_only_fields = ['id', 'enrollment_date']

class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'start_date', 'end_date']

class ContentSerializer(serializers.ModelSerializer):
    formatted_description = serializers.SerializerMethodField()

    class Meta:
        model = Content
        fields = [ 'title', 'description', 'formatted_description']
    
    def get_formatted_description(self, obj):
        return markdown.markdown(obj.description)

class AssessmentSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Assessment
        fields = [ 'title', 'description', 'questions']

class QuestionSerializer(serializers.ModelSerializer):
    options = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = [ 'question_text', 'options']

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['option_text', 'is_correct']

class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = [ 'content', 'timestamp']
