# myapp/decorators.py

from functools import wraps
from rest_framework.response import Response
from rest_framework import status


def require_valid_token(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'Invalid or missing token'}, status=status.HTTP_401_UNAUTHORIZED)
        return view_func(request, *args, **kwargs)
    return _wrapped_view
