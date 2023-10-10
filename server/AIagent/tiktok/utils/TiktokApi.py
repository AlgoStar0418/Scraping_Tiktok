from playwright.async_api import async_playwright, Page, BrowserContext
import dataclasses
import random
from typing import Union, List, Any
import time
import logging
import asyncio
from urllib.parse import urlparse, urlencode, quote
from typing import Dict
from .trending import Trending
from .video import Video
from .user import User
from .sound import Sound
from .hashtag import Hashtag
from .exceptions import *
from .comment import Comment
import json


@dataclasses.dataclass
class TikTokPlaywrightSession:
    context: BrowserContext
    page: Page
    proxy: Union[str, None]
    params: Union[dict, None]
    headers: Union[dict, None]
    ms_token: Union[str, None]

    def __init__(self, context, page, proxy, params, headers, ms_token):
        self.context = context
        self.page = page
        self.proxy = proxy
        self.params = params
        self.headers = headers
        self.ms_token = ms_token


class TikTokApi:

    user = User
    video = Video
    sound = Sound
    hashtag = Hashtag
    comment = Comment
    trending = Trending
    # search = Search

    def __init__(self, logging_level: int = logging.WARN, logger_name: str = __name__):
        self.sessions: List[TikTokPlaywrightSession] = []
        self.__create_logger(logger_name, logging_level)
        Trending.parent = self
        Video.parent = self

    def __create_logger(self, name: str, level: int = logging.DEBUG):
        """Create a logger for the class."""
        self.logger: logging.Logger = logging.getLogger(name)
        self.logger.setLevel(level)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

    async def __set_session_params(self, session: TikTokPlaywrightSession):
        user_agent = await session.page.evaluate("() => navigator.userAgent")
        language = await session.page.evaluate(
            "() => navigator.language || navigator.userLanguage"
        )
        platform = await session.page.evaluate("() => navigator.platform")
        device_id = str(random.randint(10**18, 10**19 - 1))  # Random device id
        history_len = str(random.randint(1, 10))  # Random history length
        screen_height = str(random.randint(600, 1080))  # Random screen height
        screen_width = str(random.randint(800, 1920))  # Random screen width
        timezone = await session.page.evaluate(
            "() => Intl.DateTimeFormat().resolvedOptions().timeZone"
        )

        session_params = {
            "aid": "1988",
            "app_language": language,
            "app_name": "tiktok_web",
            "browser_language": language,
            "browser_name": "Mozilla",
            "browser_online": "true",
            "browser_platform": platform,
            "browser_version": user_agent,
            "channel": "tiktok_web",
            "cookie_enabled": "true",
            "device_id": device_id,
            "device_platform": "web_pc",
            "focus_state": "true",
            "from_page": "user",
            "history_len": history_len,
            "is_fullscreen": "false",
            "is_page_visible": "true",
            "language": language,
            "os": platform,
            "priority_region": "",
            "referer": "",
            "region": "US",  # TODO: TikTokAPI option
            "screen_height": screen_height,
            "screen_width": screen_width,
            "tz_name": timezone,
            "webcast_language": language,
        }
        session.params = session_params

    async def __create_session(
        self,
        url: str = "https://www.tiktok.com",
        ms_token: Union[str, None] = None,
        proxy: Union[Any, None,] = None,
        context_options: dict = {},
        sleep_after: int = 1,
        cookies: Union[dict, None] = None
    ):
        if ms_token is not None:
            if cookies is None:
                cookies = {}
            cookies["msToken"] = ms_token
        context = await self.browser.new_context(proxy=proxy, **context_options)
        if cookies is not None:
            formatted_cookies: List[Any] = [
                {"name": k, "value": v, "domain": urlparse(
                    url).netloc, "path": "/"}
                for k, v in cookies.items()
                if v is not None
            ]
            await context.add_cookies(formatted_cookies)

        page = await context.new_page()

        request_headers = None

        def handle_request(request):
            nonlocal request_headers
            request_headers = request.headers

        page.once("request", handle_request)

        await page.goto(url, timeout=0)

        session = TikTokPlaywrightSession(
            context=context,
            page=page,
            proxy=proxy,
            params=None,
            headers=request_headers,
            ms_token=ms_token,
        )

        if ms_token is None:
            # TODO: Find a better way to wait for msToken
            time.sleep(sleep_after)
            cookies = await self.get_session_cookies(session)
            ms_token = cookies.get("msToken")
            session.ms_token = ms_token
            if ms_token is None:
                self.logger.info(
                    f"Failed to get msToken on session index {len(self.sessions)}, you should consider specifying ms_tokens"
                )
        self.sessions.append(session)
        await self.__set_session_params(session)

    async def create_sessions(
        self,
        num_sessions=5,
        headless=True,
        ms_tokens: Union[List[str], None] = None,
        proxies: Union[List[Any], None] = None,
        sleep_after=1,
        starting_url="https://www.tiktok.com",
        context_options: dict = {},
        override_browser_args: Union[Any, None] = None,
        cookies: Union[List[dict], None] = None,
    ):
        self.playwright = await async_playwright().start()
        if headless and override_browser_args is None:
            override_browser_args = ["--headless=new"]
            headless = False
        self.browser = await self.playwright.chromium.launch(
            headless=headless, args=override_browser_args
        )

        await asyncio.gather(
            *(
                self.__create_session(
                    proxy=random_choice(proxies),
                    ms_token=random_choice(ms_tokens),
                    url=starting_url,
                    context_options=context_options,
                    sleep_after=sleep_after,
                    cookies=random_choice(cookies),
                )
                for _ in range(num_sessions)
            )
        )
        self.num_sessions = len(self.sessions)

    async def get_session_cookies(self, session: TikTokPlaywrightSession):
        cookies: List[Any] = await session.context.cookies()
        return {cookie["name"]: cookie["value"] for cookie in cookies}

    async def close_sessions(self):

        for session in self.sessions:
            await session.page.close()
            await session.context.close()
        self.sessions.clear()

        await self.browser.close()
        await self.playwright.stop()

    def generate_js_fetch(self, method: str, url: str, headers: dict) -> str:

        headers_js = json.dumps(headers)
        return f"""
            () => {{
                return new Promise((resolve, reject) => {{
                    fetch('{url}', {{ method: '{method}', headers: {headers_js} }})
                        .then(response => response.text())
                        .then(data => resolve(data))
                        .catch(error => reject(error.message));
                }});
            }}
        """

    def _get_session(self, **kwargs):
        if kwargs.get("session_index") is not None:
            i = kwargs["session_index"]
        else:
            i = random.randint(0, self.num_sessions - 1)
        return i, self.sessions[i]

    async def run_fetch_script(self, url: str, headers: dict, **kwargs):
        js_script = self.generate_js_fetch("GET", url, headers)
        _, session = self._get_session(**kwargs)
        result = await session.page.evaluate(js_script)
        return result

    async def generate_x_bogus(self, url: str, **kwargs):
        _, session = self._get_session(**kwargs)
        result = await session.page.evaluate(
            f'() => {{ return window.byted_acrawler.frontierSign("{url}") }}'
        )
        return result

    async def sign_url(self, url: str, **kwargs):
        i, session = self._get_session(**kwargs)

        # TODO: Would be nice to generate msToken here

        # Add X-Bogus to url
        x_bogus = (await self.generate_x_bogus(url, session_index=i)).get("X-Bogus")
        if x_bogus is None:
            raise Exception("Failed to generate X-Bogus")

        if "?" in url:
            url += "&"
        else:
            url += "?"
        url += f"X-Bogus={x_bogus}"

        return url

    async def make_request(
        self,
        url: str,
        headers: Union[Dict[str, Any], None] = None,
        params: Union[Dict[str, Any], None] = None,
        retries: int = 3,
        exponential_backoff: bool = True,
        **kwargs,
    ):
        if params is None or headers is None:
            params = {}
            headers = {}

        i, session = self._get_session(**kwargs)
        if session.params is not None:
            params = {**session.params, **params}

        if session.headers:
            if headers is not None:
                headers = {**session.headers, **headers}
            else:
                headers = session.headers

        # get msToken
        if params.get("msToken") is None:
            # try to get msToken from session
            if session.ms_token is not None:
                params["msToken"] = session.ms_token
            else:
                # we'll try to read it from cookies
                cookies = await self.get_session_cookies(session)
                ms_token = cookies.get("msToken")
                if ms_token is None:
                    self.logger.warn(
                        "Failed to get msToken from cookies, trying to make the request anyway (probably will fail)"
                    )
                params["msToken"] = ms_token

        encoded_params = f"{url}?{urlencode(params, quote_via=quote)}"
        signed_url = await self.sign_url(encoded_params, session_index=i)

        retry_count = 0
        print(signed_url)
        while i < retries:
            retry_count += 1
            result = await self.run_fetch_script(
                signed_url, headers=headers, session_index=i
            )
            print(result)
            if result is None:
                raise Exception("TikTokApi.run_fetch_script returned None")

            if result == "":
                raise EmptyResponseException(result, "Empty response")
            print(result)
            try:
                data = json.loads(result)
                if data.get("status_code") != 0:
                    self.logger.error(f"Got an unexpected status code: {data}")
                return data
            except json.decoder.JSONDecodeError:
                if retry_count == retries:
                    self.logger.error(
                        f"Failed to decode json response: {result}")
                    raise InvalidJSONException(
                        "invalid json", "error decoding json")

                self.logger.info(
                    f"Failed a request, retrying ({retry_count}/{retries})"
                )
                if exponential_backoff:
                    await asyncio.sleep(2**retry_count)
                else:
                    await asyncio.sleep(1)

    async def stop_playwright(self):
        """Stop the playwright browser"""
        await self.browser.close()
        await self.playwright.stop()

    async def get_session_content(self, url: str, **kwargs):
        """Get the content of a url"""
        _, session = self._get_session(**kwargs)
        return await session.page.content()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.close_sessions()
        await self.stop_playwright()


def random_choice(choices: Union[List[Any], None]):
    if choices is None or len(choices) == 0:
        return None
    return random.choice(choices)
