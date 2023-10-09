import { Browser, BrowserContext, Page } from "playwright";
import User from "./api/user";
import chalk from "chalk";
import Video from "./api/video";
import { EmptyReponseException, InvalidJSONException } from "./errors";
import Sound from "./api/sound";
import Hashtag from "./api/hashtag";
import Comment from "./api/comment";
import { Trending } from "./api/trending";

interface Logger {
  debug: (msg: string, stack?: string) => void;
  info: (msg: string, stack?: string) => void;
  warn: (msg: string, stack?: string) => void;
  error: (msg: string, stack?: string) => void;
}

export interface Proxy {
  server: string;
  bypass?: string;
  username?: string;
  password?: string;
}

class TikTokPlaywrightSession {
  context: BrowserContext;
  page: Page;
  proxy?: Proxy;
  params?: Record<string, any>;
  headers?: Record<string, any>;
  ms_token?: string;
  base_url: string = "https://www.tiktok.com";

  // constructor must have named parameters
  constructor({
    context,
    page,
    proxy,
    params,
    headers,
    ms_token,
  }: {
    context: BrowserContext;
    page: Page;
    proxy?: Proxy;
    params?: Record<string, any>;
    headers?: Record<string, any>;
    ms_token?: string;
  }) {
    this.context = context;
    this.page = page;
    this.proxy = proxy;
    this.params = params;
    this.headers = headers;
    this.ms_token = ms_token;
  }
}

class TikTokApi {
  user = User;
  video = Video;
  sound = Sound;
  hashtag = Hashtag;
  trending = Trending;

  comment = Comment;
  logger: Logger;
  sessions: TikTokPlaywrightSession[] = [];
  playwright?: typeof import("playwright");
  browser?: Browser;
  num_sessions?: number;

  constructor(logger_name?: string) {
    if (!logger_name) {
      logger_name = "TikTokApi";
    }
    this.logger = this.__create_logger(logger_name);
    User.parent = this;
    Video.parent = this;
    Sound.parent = this;
    Hashtag.parent = this;
    Trending.parent = this;
  }

  __create_logger(name: string): Logger {
    return {
      debug: (msg: string, stack?: string) =>
        console.log(
          chalk.blueBright(`[${name}] ${msg}`) + stack
            ? chalk.blueBright(`[${name}] ${stack}`)
            : ""
        ),
      info: (msg: string, stack?: string) =>
        console.log(
          chalk.greenBright(`[${name}] ${msg}`) + stack
            ? chalk.greenBright(`[${name}] ${stack}`)
            : ""
        ),
      warn: (msg: string, stack?: string) =>
        console.log(
          chalk.yellowBright(`[${name}] ${msg}`) + stack
            ? chalk.yellowBright(`[${name}] ${stack}`)
            : ""
        ),
      error: (msg: string, stack?: string) =>
        console.log(
          chalk.redBright(`[${name}] ${msg}`) + stack
            ? chalk.redBright(`[${name}] ${stack}`)
            : ""
        ),
    };
  }

  async __set_session_params(session: TikTokPlaywrightSession): Promise<void> {
    const user_agent = await session.page.evaluate(() => navigator.userAgent);
    const language = await session.page.evaluate(
      () => navigator.language || navigator.userLanguage
    );
    const platform = await session.page.evaluate(() => navigator.platform);
    const device_id = String(
      Math.floor(
        Math.random() * (Math.pow(10, 19) - Math.pow(10, 18)) + Math.pow(10, 18)
      )
    );
    const history_len = String(Math.floor(Math.random() * 10) + 1);
    const screen_height = String(
      Math.floor(Math.random() * (1080 - 600 + 1)) + 600
    );
    const screen_width = String(
      Math.floor(Math.random() * (1920 - 800 + 1)) + 800
    );
    const timezone = await session.page.evaluate(
      () => Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const session_params = {
      aid: "1988",
      app_language: language,
      app_name: "tiktok_web",
      browser_language: language,
      browser_name: "Mozilla",
      browser_online: "true",
      browser_platform: platform,
      browser_version: user_agent,
      channel: "tiktok_web",
      cookie_enabled: "true",
      device_id: device_id,
      device_platform: "web_pc",
      focus_state: "true",
      from_page: "user",
      history_len: history_len,
      is_fullscreen: "false",
      is_page_visible: "true",
      language: language,
      os: platform,
      priority_region: "",
      referer: "",
      region: "US", // TODO: TikTokAPI option
      screen_height: screen_height,
      screen_width: screen_width,
      tz_name: timezone,
      webcast_language: language,
    };
    session.params = session_params;
  }

  async __create_session({
    url = "https://www.tiktok.com",
    ms_token,
    proxy,
    context_options = {},
    sleep_after = 1,
    cookies,
  }: {
    url?: string;
    ms_token?: string;
    proxy?: Proxy;
    context_options?: Record<string, any>;
    sleep_after?: number;
    cookies?: Record<string, string>;
  } = {}): Promise<TikTokPlaywrightSession> {
    if (ms_token) {
      if (!cookies) {
        cookies = {};
      }
      cookies["msToken"] = ms_token;
    }

    const context = await this.browser?.newContext({
      proxy: proxy,
      ...context_options,
    });
    if (cookies) {
      const formatted_cookies = Object.entries(cookies).map(([k, v]) => ({
        name: k,
        value: v,
        domain: new URL(url).hostname,
        path: "/",
      }));
      await context?.addCookies(formatted_cookies);
    }
    const page = await context?.newPage();
    // await stealth_async(page);

    // Get the request headers to the URL
    let request_headers: Record<string, any> | undefined = undefined;

    page?.once("request", (request) => {
      request_headers = request.headers();
    });

    await page?.goto(url, {
      timeout: 0,
    });

    const session = new TikTokPlaywrightSession({
      context: context!,
      page: page!,
      proxy: proxy,
      ms_token: ms_token,
      headers: request_headers,
    });
    if (!ms_token) {
      cookies = await this.get_session_cookies(session);
      ms_token = cookies["msToken"];
      session.ms_token = ms_token;
      if (!ms_token) {
        this.logger.info(
          `Failed to get msToken on session index ${this.sessions.length}, you should consider specifying ms_tokens`
        );
      }
    }
    this.sessions.push(session);
    await this.__set_session_params(session);

    return session;
  }
  async createSessions({
    num_sessions = 5,
    headless = true,
    ms_tokens,
    proxies,
    sleep_after = 1,
    starting_url = "https://www.tiktok.com",
    context_options = {},
    override_browser_args,
    cookies,
  }: {
    num_sessions?: number;
    headless?: boolean;
    ms_tokens?: string[];
    proxies?: Proxy[];
    sleep_after?: number;
    starting_url?: string;
    context_options?: Record<string, any>;
    override_browser_args?: string[];
    cookies?: Record<string, string>[];
  } = {}): Promise<void> {
    this.playwright = await import("playwright");
    if (headless && !override_browser_args) {
      override_browser_args = ["--headless=new"];
      headless = false; // managed by the arg
    }
    this.browser = await this.playwright.firefox.launch({
      headless: headless,
      args: override_browser_args,
    });

    await Promise.all(
      Array.from({ length: num_sessions }, (_, i) =>
        this.__create_session({
          proxy: proxies ? proxies[i % proxies.length] : undefined,
          ms_token: ms_tokens ? ms_tokens[i % ms_tokens.length] : undefined,
          url: starting_url,
          context_options: context_options,
          sleep_after: sleep_after,
          cookies: cookies ? cookies[i % cookies.length] : undefined,
        })
      )
    );
    this.num_sessions = this.sessions.length;
  }

  async get_session_cookies(session: TikTokPlaywrightSession) {
    const cookies = await session.context.cookies();
    const cookies_dict: Record<string, string> = {};
    for (const cookie of cookies) {
      cookies_dict[cookie.name] = cookie.value;
    }
    return cookies_dict;
  }

  async make_request({
    url,
    headers,
    params,
    retries = 3,
    exponential_backoff = true,
    ...kwargs
  }: {
    url: string;
    headers?: Record<string, any>;
    retries?: number;
    params: Record<string, any>;
    exponential_backoff?: boolean;
    session_index?: number;
  }) {
    let [i, session] = this.get_session({
      session_index: kwargs.session_index,
    });
    if (session.params) {
      params = { ...session.params, ...params };
    }
    if (headers) {
      headers = { ...session.headers, ...headers };
    }

    if (!params["msToken"]) {
      if (session.ms_token) {
        params["msToken"] = session.ms_token;
      } else {
        let cookies = await this.get_session_cookies(session);
        let ms_token = cookies["msToken"];
        if (!ms_token) {
          this.logger.warn(
            "Failed to get msToken from cookies, trying to make the request anyway (probably will fail)"
          );
        }
        params[ms_token] = ms_token;
      }
    }

    const encodedParams = `${url}?${new URLSearchParams(params)}`;
    const signedUrl = await this.signUrl(encodedParams, { session_index: i });
    let retry_count = 0;
    while (i < retries) {
      retry_count += 1;
      let result = await this.run_fetch_script(signedUrl, {
        headers: headers!,
        session_index: i,
      });
      if (!result) {
        throw Error("TiktokApi.run_fetch_script returned null");
      }
      if (result === "") {
        throw new EmptyReponseException(result, "Response is empty");
      }
      try {
        let data = JSON.parse(result);
        if (data.status_code != 0) {
          this.logger.error(`Got an unexpected status code: ${data}`);
        }
        return data;
      } catch (error) {
        if (retry_count === retries) {
          this.logger.error("Failed to decode json response: " + result);
          throw new InvalidJSONException(
            result,
            "Failed to decode json response"
          );
        }
        this.logger.info(
          `Failed a request, retrying (${retry_count}/${retries})`
        );
        if (exponential_backoff) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2 ** retry_count * 1000)
          );
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }

  async closeSessions(): Promise<void> {
    for (const session of this.sessions) {
      await session.page.close();
      await session.context.close();
    }
    this.sessions = [];
  }

  async stopPlaywright(): Promise<void> {
    await this.browser?.close();
  }

  async getSessionContent(url: string, kwargs: any): Promise<string> {
    const [_, session] = this.get_session(kwargs);
    return await session.page.content();
  }

  async withApi(callback: (api: TikTokApi) => Promise<void>) {
    try {
      await callback(this);
    } finally {
      await this.closeSessions();
      await this.stopPlaywright();
    }
  }

  async run_fetch_script(
    url: string,
    {
      headers,
      ...kwargs
    }: { headers: Record<string, any>; session_index?: number }
  ): Promise<string> {
    const [_, session] = this.get_session({ ...kwargs });
    let data = { url, headers };
    let result = await session.page.evaluate(({ url, headers }) => {
      return new Promise((resolve, reject) => {
        fetch(url, { method: "GET", headers: JSON.stringify(headers) })
          .then((response) => response.text())
          .then((data) => resolve(data))
          .catch((error) => reject(error.message));
      });
    }, data);
    return result;
  }

  async signUrl(url: string, { ...kwargs }: { session_index?: number }) {
    const [i, session] = this.get_session({ ...kwargs });
    let x_bogus = await this.generate_x_bogus(url, { session_index: i });
    if (!x_bogus) {
      throw Error("Failed to generate x-Bogus");
    }

    if (url.includes("?")) {
      url += "&";
    } else {
      url += "?";
    }
    let bogus = x_bogus["X-Bogus"];
    url += `X-Bogux=${bogus}`;
    return url;
  }

  async generate_x_bogus(
    url: string,
    { ...kwargs }: { session_index?: number }
  ): Promise<Record<string, string>> {
    let [_, session] = this.get_session({ ...kwargs });

    const result = await session.page.evaluate((url) => {
      return window.byted_acrawler.frontierSign(`${url}`);
    }, url);
    return result;
  }

  get_session({
    ...kwargs
  }: {
    session_index?: number;
  }): [number, TikTokPlaywrightSession] {
    let i;
    if (kwargs.session_index) {
      i = kwargs.session_index;
    } else {
      i = Math.floor(Math.random() * this.sessions.length);
    }
    return [i, this.sessions[i]];
  }
}

export default TikTokApi;
