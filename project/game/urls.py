# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('start/', views.start, name='start'),
    path('add_users/', views.add_user, name = 'add_user'),
]
