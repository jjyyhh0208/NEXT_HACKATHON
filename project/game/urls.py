# myapp/urls.py
from django.contrib import admin
from django.urls import path
from game import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.main, name='main'),
    path('name/', views.name, name='name'),
    path('add_users/', views.add_user, name='add_user'),
    path('ranking/', views.ranking, name='ranking'),
    path('start/', views.start, name='start'),
    path('game/<int:department_id>/<int:professor_id>', views.game, name='game'),
    path('index/', views.index, name='index'),
    path('submit-score/', views.submit_score, name='submit_score'),
]
