from .models import Professor, Department
from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Professor)
admin.site.register(Department)
