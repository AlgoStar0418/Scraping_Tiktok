# tiktok_initializer.py
from .utils.TiktokApi import TikTokApi
import asyncio

api = TikTokApi()
ms_token = "kHzDwwRqOx0kP_4XXg2IGlo0dh7P1aWS73iGI8is0FBdTmLUB2Ghh0xJNSyBAKq-xlkfqbXOEgiBNnHTF0ByiInM9m5PvvExqRqoDPQQK9h-xwaia_sbHU8___RvlaFHFIgnh1e7mcp3cQ=="


async def initialize_sessions():
    await api.create_sessions(num_sessions=1, ms_tokens=[ms_token])


asyncio.run(initialize_sessions())
