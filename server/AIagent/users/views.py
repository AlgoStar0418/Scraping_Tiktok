from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import User
import re
import jwt
import datetime


class Register(APIView):
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            is_valid = serializer.is_valid()
            if not is_valid:
                return Response({'error':  serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()

            payload = {
                'id': str(serializer.data['uid']),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow(),
            }

            token = jwt.encode(payload, 'secret', algorithm='HS256')

            return Response({
                'token': token,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Login(APIView):
    def post(self, request):
        try:
            username_or_email = request.data['username_or_email'] if 'username_or_email' in request.data else None
            password = request.data['password'] if 'password' in request.data else None
            if username_or_email is None or password is None or username_or_email == '' or password == '':
                errors = []
                if username_or_email is None or username_or_email == '':
                    errors.append('username_or_email is required')
                if password is None or password == '':
                    errors.append('password is required')
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

            if is_email(username_or_email):
                user = User.objects.filter(email=username_or_email).first()
            else:
                user = User.objects.filter(username=username_or_email).first()

            if user is None:
                return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

            if not user.check_password(password):
                return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
            payload = {
                'id': str(user.uid),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow(),
            }

            token = jwt.encode(payload, 'secret', algorithm='HS256')
            return Response({
                'token': token,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RefreshToken(APIView):
    def post(self, request):
        try:
            token = request.headers['Authorization']
            token = token.split('Bearer ')[1]
            try:
                payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            except jwt.ExpiredSignatureError:
                payload = jwt.decode(token, 'secret', algorithms=['HS256'])

            payload['exp'] = datetime.datetime.utcnow() + \
                datetime.timedelta(minutes=60)
            payload['iat'] = datetime.datetime.utcnow()
            token = jwt.encode(payload, 'secret', algorithm='HS256')
            return Response({
                'token': token,
            }, status=status.HTTP_200_OK)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Me(APIView):
    def get(self, request):
        try:
            token = request.headers['Authorization']
            token = token.split('Bearer ')[1]
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            user = User.objects.filter(user=payload['id']).first()
            if user is None:
                return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def split_fullname(fullname):
    fullname = fullname.split(' ')
    if len(fullname) == 1:
        return fullname[0], ''
    else:
        return fullname[0], ' '.join(fullname[1:])


def is_email(email):
    if re.match(r'^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$', email):
        return True
    else:
        return False
