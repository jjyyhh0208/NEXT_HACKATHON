# myapp/forms.py
from django import forms
from .models import *


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username']


class StartForm(forms.Form):
<<<<<<< HEAD
    username = forms.CharField(label='Nickname', max_length=100)
=======
>>>>>>> main
    department = forms.ModelChoiceField(
        queryset=Department.objects.all(), label='Department')
    professor = forms.ModelChoiceField(
        queryset=Professor.objects.all(), label='Professor')
