from __future__ import annotations
from .exceptions import InvalidResponseException
from .video import Video

from typing import TYPE_CHECKING, List, AsyncGenerator, Any

if TYPE_CHECKING:
    from .TiktokApi import TikTokApi


class Trending:
    """Contains static methods related to trending objects on TikTok."""

    parent: TikTokApi

    @staticmethod
    async def videos(count=30, **kwargs) :

        found = 0
        while found < count:
            params = {
                "from_page": "fyp",
                "count": 30,
            }

            resp = await Trending.parent.make_request(
                url="https://www.tiktok.com/api/recommend/item_list/",
                params=params,
                headers=kwargs.get("headers"),
                session_index=kwargs.get("session_index"),
            )

            if resp is None:
                raise InvalidResponseException(
                    resp, "TikTok returned an invalid response."
                )

            for video in resp.get("itemList", []):
                yield Trending.parent.video(data=video)
                found += 1

            if not resp.get("hasMore", False):
                return
