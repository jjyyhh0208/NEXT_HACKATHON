from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .forms import *
from .models import *

# Create your views here.


def main(request):
    return render(request, 'main.html')


def start(request):
    departments = Department.objects.all()
    professors = Professor.objects.all()
    if request.method == 'POST':
        form = StartForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            department = form.cleaned_data['department']
            professor = form.cleaned_data['professor']
            return redirect(reverse('game', args=[username, department.id, professor.id]))
    else:
        form = StartForm()
    return render(request, 'start.html', {'form': form, 'departments': departments, 'professors': professors})


def add_user(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.score = 0
            user.save()
            return redirect('user_list')
    else:
        form = UserForm()

    ctx = {
        'form': form,
    }

    return render(request, 'game.html', ctx)


def game(request, username, department_id, professor_id):
    department = Department.objects.get(id=department_id)
    professor = Professor.objects.get(id=professor_id)
    return render(request, 'game.html', {'username': username, 'department': department, 'professor': professor})
