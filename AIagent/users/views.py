# now let's make authorization and authentication we need to have a token stuffs in it
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth import logout
from django.contrib.auth import login
from . import models
from django.views.decorators.csrf import ensure_csrf_cookie

# Create your views here.

# @api_view(['POST'])
# @/
def register(request):
    print(request)

def split_fullname(fullname):
    fullname = fullname.split(' ')
    if len(fullname) == 1:
        return fullname[0], ''
    else:
        return fullname[0], ' '.join(fullname[1:])
