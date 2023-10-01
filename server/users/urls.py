# users/urls.py

from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('token/', views.CustomAuthToken.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.RefreshToken.as_view(), name='token_refresh'),
    path('register/', views.RegisterUser.as_view(), name='register'),
    path('google-login/', views.GoogleLogin.as_view(), name='google-login'),
    path('google-register', views.GoogleRegister.as_view(), name='google-register'),
]
