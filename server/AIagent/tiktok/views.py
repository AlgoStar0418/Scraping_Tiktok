from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .tiktok_initializer import api
from asgiref.sync import async_to_sync
import asyncio
from threading import Thread

class Trending(APIView):
    def get(self, request):
        try:
            limit = request.GET.get('limit', None)
            if limit is None or limit == '':
                return Response({'error': 'limit is required'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                limit = int(limit)
            except ValueError:
                return Response({'error': "limit must be number"}, status=status.HTTP_400_BAD_REQUEST)

            videos = self.get_videos(limit)

            return Response({
                'trending': videos,
                'limit': limit,
                'total': 1,
            })

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    async def get_videos(self, limit):
        return [video async for video in api.trending.videos(count=limit)]
