# myapp/urls.py
from django.contrib import admin
from django.urls import path
from game import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.main, name='main'),
    path('start/', views.start, name='start'),
    path('add_users/', views.add_user, name='add_user'),
    path('game/', views.game, name='game'),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
