# myapp/forms.py
from django import forms
from .models import *


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username']


class StartForm(forms.Form):
    department = forms.ModelChoiceField(
        queryset=Department.objects.all(), label='Department')
    professor = forms.ModelChoiceField(
        queryset=Professor.objects.all(), label='Professor')
