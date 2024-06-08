from django.shortcuts import render, redirect
from .forms import *
from .models import *

# Create your views here.
def main(request):
    return render(request, 'main.html')

def start(request):
    return render(request, 'start.html')

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