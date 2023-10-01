from django.db import models
from django.contrib.auth.models import User

import markdown
from django.utils.text import slugify


class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    bio = models.TextField()
    learners = models.ManyToManyField(User, related_name='instructors', blank=True)

    def __str__(self):
        return self.user.username


class Enrollment(models.Model):
    course = models.ForeignKey("Course", on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Student: {self.student.username}, Course: {self.course.title}"


class Course(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique = True, max_length=255)
    description = models.TextField()
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()

    def get_enrolled_students(self):
        return Enrollment.objects.filter(course=self).select_related('student')
        
    def save(self, *args, **kwargs):
        # Automatically generate the slug from the title when saving the object
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} by {self.instructor.user.username.capitalize()}. "


class Content(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique = True, max_length=255)
    description = models.TextField()

    def save(self, *args, **kwargs):
        # Automatically generate the slug from the title when saving the object
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def formatted_description(self):
        return markdown.markdown(self.description)

    def __str__(self):
        return f"{self.title} ({self.course.title})."


class Assessment(models.Model):
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    title = models.CharField(max_length=256)
    description = models.TextField()

    def __str__(self):
        return f"Assesment# {self.pk}, Content: {self.content.title}, Course: {self.content.course.title}"


class Question(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    question_text = models.TextField()

    def get_options(self):
        return self.option_set.all()
    def __str__(self):
        return f"Questions of Assessment# {self.assessment.pk}, Content: {self.assessment.content.title}, Course: {self.assessment.content.course.title}"


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Options of Question# {self.question.pk}, Assessment# {self.question.assessment.pk}, Content: {self.question.assessment.content.title}, Course: {self.question.assessment.content.course.title}"


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Message from {self.sender.username}, Course: {self.course.title} (by {self.course.instructor.user.username}), "



