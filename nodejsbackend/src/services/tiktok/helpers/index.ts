import { TikTokApiException, InvalidURLException } from "../errors";
import axios, { AxiosRequestConfig } from "axios";
import { HttpProxyAgent } from "http-proxy-agent";

export async function extractVideoIdFromUrl(
  url: string,
  headers: Record<string, any> = {},
  proxy?: string
): Promise<string> {
  const axiosConfig: AxiosRequestConfig = {
    method: "HEAD",
    headers,
    maxRedirects: 5, // Set the maximum number of redirects
    httpAgent: proxy ? new HttpProxyAgent(proxy) : undefined,
    validateStatus: (status) => status < 400, // Only consider status codes less than 400 as success
  };

  try {
    const response = await axios(url, axiosConfig);

    if (response.status < 400) {
      return response.request.res.responseUrl;
    } else {
      throw new InvalidURLException(
        "URL format not supported. Below is an example of a supported URL:\n" +
          "https://www.tiktok.com/@therock/video/6829267836783971589"
      );
    }
  } catch (error: any) {
    throw new TikTokApiException(
      `Failed to fetch URL: ${url}. ${error.message}`
    );
  }
}

export function randomChoice<T>(choices: T[]): T | null {
  if (!choices || choices.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}
