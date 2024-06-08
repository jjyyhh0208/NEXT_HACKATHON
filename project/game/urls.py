# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('name/', views.name, name='name'),
    path('add_users/', views.add_user, name='add_user'),
    path('ranking/', views.ranking, name='ranking'),
    path('start/', views.start, name='start'),
    path('game/<int:department_id>/<int:professor_id>', views.game, name='game'),
]
