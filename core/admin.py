from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Instructor)
admin.site.register(Course)
admin.site.register(Content)
admin.site.register(Enrollment)
admin.site.register(Assessment)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(Message)



