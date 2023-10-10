from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('/trending', views.Trending.as_view(), name="trending_tiktok")
]