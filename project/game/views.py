from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .forms import *
from .models import *
from django.contrib.auth.decorators import login_required
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

logger = logging.getLogger(__name__)

# Create your views here.


def main(request):
    return render(request, 'main.html')


def add_user(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            user, created = User.objects.get_or_create(username=username)
            if created:
                user.score = 0  # 기본값 설정
                user.save()
            request.session['username'] = user.username  # 세션에 사용자 이름 저장
            request.session.modified = True  # 세션이 수정되었음을 명시
            return redirect('start')
        else:
            logger.debug(f"Form is not valid: {form.errors}")
    else:
        form = UserForm()

    return render(request, 'name.html', {'form': form})


def name(request):
    current_username = request.session.get('username')
    if current_username:
        return render(request, 'start.html', {'logged_in': True, 'username': current_username})
    return render(request, 'name.html', {'logged_in': False})


def start(request):
    departments = Department.objects.all()
    professors = Professor.objects.all()
    if request.method == 'POST':
        form = StartForm(request.POST)
        if form.is_valid():
            department = form.cleaned_data['department']
            professor = form.cleaned_data['professor']
            return redirect(reverse('game', args=[department.id, professor.id]))
    else:
        form = StartForm()
    return render(request, 'start.html', {'form': form, 'departments': departments, 'professors': professors})
# def logout(request):
#     request.session.flush()  # 세션 데이터 삭제
#     return redirect('name')


def ranking(request):
    users = User.objects.all().order_by('-score')
    current_username = request.session.get('username')
    current_user = User.objects.get(
        username=current_username) if current_username else None

    ctx = {'users': users, 'current_user': current_user}
    return render(request, 'ranking.html', ctx)


def game(request, professor_id):

    current_username = request.session.get('username')  # 세션에서 사용자 이름 가져오기
    professor = Professor.objects.get(id=professor_id)
    ctx = {
        'professor_photo': professor.photo.url if professor.photo else None,
        'professor': professor,
        'current_username': current_username
    }

    logger.debug(f"Current username from session: {current_username}")
    return render(request, 'game.html', ctx)


def submit_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        score = data.get('score')

        user, created = User.objects.get_or_create(username=username)
        user.score = score
        user.save()

        return JsonResponse({'isSuccess': 'true'})
    return JsonResponse({'isSuccess': 'false'}, status=400)
