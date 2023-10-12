from ayrshare import SocialPost
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import time
import math

social = SocialPost('M2KRRSS-PEEMJDV-NY3MF2A-KQVZ1BQ')


class SocialMediaPost(APIView):
    def post(self, request):
        try:
            platforms = request.data['platforms']
            image = request.data['image']
            description = request.data['description'] if 'description' in request.data else 'Best Image'
            title = request.data['title'] if 'title' in request.data else 'Best Image'

            uploadResponse = social.upload({
                'file': image,
                'fileName': title + str(math.floor(time.time())) + '.png',
                'description': description,
            })
            if 'error' in uploadResponse:
                return Response({'error': uploadResponse['error']}, status=status.HTTP_400_BAD_REQUEST)
            upload_url = uploadResponse['url']
            postResponse = social.post({
                'post': title,
                'platforms': platforms,
                'mediaUrls': [upload_url],
            })
            return Response({'response': uploadResponse, 'postResponse': postResponse})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
