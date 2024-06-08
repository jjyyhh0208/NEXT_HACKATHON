# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('name/', views.name, name='name'),
    path('add_users/', views.add_user, name = 'add_user'),
    path('ranking/', views.ranking, name='ranking'),
    path('game/', views.game, name='game'),
]