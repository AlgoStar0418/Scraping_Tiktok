class InvalidResponseException extends Error {
  status?: number;
  constructor(response: any, message: string, status?: number) {
    super(message);
    this.status = status;
    this.stack = response;
    this.name = "InvalidResponseException";
  }
  toString() {
    return this.stack;
  }
}

class TikTokApiException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TikTokApiException";
  }
  toString() {
    return this.message;
  }
}

class InvalidURLException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidURLException";
  }
  toString() {
    return this.message;
  }
}

class EmptyReponseException extends Error {
  raw_response: string;
  constructor(raw_reponse: string, message: string) {
    super(message);
    this.name = "EmptyReponseException";
    this.raw_response = raw_reponse;
  }
  toString() {
    return this.message;
  }
}

class InvalidJSONException extends Error {
  raw_response: string;
  constructor(raw_reponse: string, message: string) {
    super(message);
    this.name = "InvalidJSONException";
    this.raw_response = raw_reponse;
  }
  toString() {
    return this.message;
  }
}

export {
  InvalidResponseException,
  TikTokApiException,
  InvalidURLException,
  EmptyReponseException,
  InvalidJSONException,
};
