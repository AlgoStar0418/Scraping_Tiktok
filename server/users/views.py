from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_jwt.settings import api_settings
from django.contrib.auth import authenticate, login
from . import models
import bcrypt
import re
import requests

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_decode_handler = api_settings.JWT_DECODE_HANDLER


class RegisterUser(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        email = request.data.get("email")
        fullname = request.data.get("fullname")
        password = request.data.get("password")

        if username is None or username == '':
            return Response({'error': 'Please provide username'}, status=status.HTTP_400_BAD_REQUEST)

        if email is None or email == '':
            return Response({'error': 'Please provide email'}, status=status.HTTP_400_BAD_REQUEST)

        if fullname is None or fullname == '':
            return Response({'error': 'Please provide fullname'}, status=status.HTTP_400_BAD_REQUEST)

        if password is None or password == '':
            return Response({'error': 'Please provide password'}, status=status.HTTP_400_BAD_REQUEST)

        if not validate_password(password):
            return Response({'error': 'Password must contain at least 8 characters, one uppercase letter and one number'}, status=status.HTTP_400_BAD_REQUEST)

        # if models.User.objects.filter(username=username).exists():
        #     return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # if models.User.objects.filter(email=email).exists():
        #     return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = hash_password(password)

        first_name, last_name = split_fullname(fullname)

        user = models.User.objects.create(
            username=username, email=email, first_name=first_name, last_name=last_name, password=hashed_password
        )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            return Response({'token': token})

        return Response({'error': 'User registration failed'}, status=status.HTTP_400_BAD_REQUEST)


class CustomAuthToken(APIView):
    def post(self, request, *args, **kwargs):
        username_or_email = request.data.get("username_or_email")
        password = request.data.get("password")

        if username_or_email is None or username_or_email == '':
            return Response({'error': 'Please provide username or email'}, status=status.HTTP_400_BAD_REQUEST)

        if password is None or password == '':
            return Response({'error': 'Please provide password'}, status=status.HTTP_400_BAD_REQUEST)

        is_email = models.validate_email(username_or_email)

        if not is_email:
            user = authenticate(
                request, username=username_or_email, password=password)
        else:
            try:
                user = models.User.objects.get(email=username_or_email)
                if user.check_password(password):
                    user = authenticate(
                        request, username=user.username, password=password)
                else:
                    user = None
            except models.User.DoesNotExist:
                user = None

        if user is not None:
            login(request, user)
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            return Response({'token': token})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class RefreshToken(APIView):
    def post(self, request):
        try:
            token = request.data['token']
            payload = jwt_decode_handler(token)
            if payload:
                # Generate a new token and return it
                token = jwt_encode_handler(
                    jwt_payload_handler(payload['user']))
                return Response({'token': token})
        except:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class GoogleLogin(APIView):
    def post(self, request):
        try:
            access_token = request.data['access_token']
            user_info = get_google_user_info(access_token)
            if user_info is None:
                return Response({'error': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)
            email = user_info['email']
            username = email.split('@')[0]
            if models.User.objects.filter(email=email).exists():
                user = models.User.objects.get(email=email)
            else:
                return Response({'error': "User doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)

            user_id = user_info['id']

            hash_password = bcrypt.hashpw(user_id)

            user = authenticate(request, username=username,
                                password=hash_password)

            if user is not None:
                login(request, user)
                payload = jwt_payload_handler(user)
                token = jwt_encode_handler(payload)
                return Response({'token': token})

            return Response({'error': 'User registration failed'}, status=status.HTTP_400_BAD_REQUEST)

        except:
            return


class GoogleRegister(APIView):
    def post(self, request):
        try:
            access_token = request.data['access_token']
            user_info = get_google_user_info(access_token)
            if user_info is None:
                return Response({'error': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)
            email = user_info['email']
            username = email.split('@')[0]
            # if models.User.objects.filter(email=email).exists():
            #     user = models.User.objects.get(email=email)
            # else:
            #     user = models.User.objects.create(
            #         username=username, email=email, first_name=full_name, last_name='', password=bcrypt.hashpw(b'12345678', bcrypt.gensalt())
            #     )
            full_name = user_info['name']
            first_name, last_name = split_fullname(full_name)
            user_id = user_info['id']
            hash_password = hash_password(user_id)
            user = models.User.objects.create(
                username=username, email=email, first_name=first_name, last_name=last_name, password=hash_password
            )
            user = authenticate(request, username=username, password=hash_password)

            if user is not None:
                login(request, user)
                payload = jwt_payload_handler(user)
                token = jwt_encode_handler(payload)
                return Response({'token': token})

            return Response({'error': 'User registration failed'}, status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response({'error': 'User registration failed'}, status=status.HTTP_400_BAD_REQUEST)


def split_fullname(fullname):
    fullname = fullname.split(' ')
    if len(fullname) == 1:
        return fullname[0], ''
    else:
        return fullname[0], ' '.join(fullname[1:])


def validate_password(password):
    regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
    if (re.search(regex, password)):
        return True
    else:
        return False


def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


def validate_email(email):
    regex = r"^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$"
    if (re.search(regex, email)):
        return True
    else:
        return False


def get_google_user_info(access_token):
    url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + access_token
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return None
