from django.urls import path
from . import views

app_name = 'tiktok'

urlpatterns = [
    path('trending', views.Trending.as_view(), name='trending_tiktok')
]
