from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import *


def is_enrolled_student(user, course):
    enrolled_students = course.get_enrolled_students()
    return user.pk in enrolled_students.values_list('student__pk', flat=True)

def get_course(view):
    course_slug = view.kwargs.get('course_slug')
    return get_object_or_404(Course, slug=course_slug)


class IsOwnerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            # Allow read-only access for safe methods (GET, HEAD, OPTIONS)
            return True

        # For write methods (POST, PUT, PATCH, DELETE), check if the user is authenticated
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow safe methods for all users
        if request.method in SAFE_METHODS:
            return True

        # For write methods (POST, PUT, PATCH, DELETE), check if the authenticated user
        # is the owner of the instructor profile being accessed
        return obj.user == request.user


class CoursesPermission(BasePermission):
    def has_permission(self, request, view):
        # Allow instructor to create a course
        return request.user.is_authenticated and hasattr(request.user, 'instructor')

    def has_object_permission(self, request, view, obj):
        # Allow instructors to update and delete their own courses
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            return request.user == obj.instructor.user

        return True  # Allow any user to retrieve a course


class ContentPermission(BasePermission):
    def has_permission(self, request, view):
        course = get_course(view)

        if request.method in SAFE_METHODS:
            return request.user == course.instructor.user or is_enrolled_student(request.user, course)

        return request.user == course.instructor.user

    def has_object_permission(self, request, view, obj):
        course = get_course(view)

        if request.method in SAFE_METHODS: 
            return request.user == course.instructor.user or is_enrolled_student(request.user, course)

        return request.user == course.instructor.user


class MessagesPermission(BasePermission):
    def has_permission(self, request, view):
        course = get_course(view)

        if request.user == course.instructor.user or is_enrolled_student(request.user, course):
            return True

        return False
        
    def has_object_permission(self, request, view, obj):
        """
        Only allow the instructor and enrolled students related to the course
        to view and edit their own messages.
        """
        if request.user == obj.sender :
            return True

        return False


