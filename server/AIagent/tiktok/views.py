from TikTokApi import TikTokApi
import requests
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
api = TikTokApi()
from AIagent.middleware.jwt_middleware import validate_jwt_token


class Trending(APIView):
    def get(self, request):
        try:
            valid = validate_jwt_token(request)
            if type(valid) is not bool:
                return Response(valid, status=status.HTTP_401_UNAUTHORIZED)

            limit = request.GET.get('limit')
            
            if limit is None:
                return Response({'error': 'specify limit of the trending videos'}, status=400)
            limit = int(limit)
            trending = api.trending(count=limit)
            response_data = {
                'trending': trending,
                'total': len(trending),
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except:
            return Response({
                'error': 'error getting trending videos',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class Post(APIView):

#     @require_valid_token
#     def get(self, request):
#         try:
#             author = request.GET.get('author', None)
#             video_id = request.GET.get('video_id', None)

#             if author is None or video_id is None:
#                 return JsonResponse({'error': 'Please provide both author and video_id'})

#             video_link = f'https://www.tiktok.com/@{author}/video/{video_id}'

#             embed_url = f'https://www.tiktok.com/oembed?url={video_link}'
#             response = requests.get(embed_url)

#             if response.status_code != 200:
#                 return JsonResponse({'error': 'Invalid author or video_id'}, status=400)

#             return JsonResponse(response.json(), status=200)

#         except:
#             return JsonResponse({'error': 'error getting tiktok data'}, status=500)


# class Video(APIView):

#     @require_valid_token
#     def get(self, request):
#         try:
#             download_url = request.GET.get('download_url', None)

#             if download_url is None:
#                 return JsonResponse({'error': 'Please provide download_url'}, status=400)

#             response = api.get_Video_By_DownloadURL(download_url=download_url)

#             return JsonResponse(response)

#         except:
#             return JsonResponse({
#                 'error': 'error getting video data',
#             }, status=500)
