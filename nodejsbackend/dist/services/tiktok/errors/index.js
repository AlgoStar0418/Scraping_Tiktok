"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidJSONException = exports.EmptyReponseException = exports.InvalidURLException = exports.TikTokApiException = exports.InvalidResponseException = void 0;
class InvalidResponseException extends Error {
    constructor(response, message, status) {
        super(message);
        this.status = status;
        this.stack = response;
        this.name = "InvalidResponseException";
    }
    toString() {
        return this.stack;
    }
}
exports.InvalidResponseException = InvalidResponseException;
class TikTokApiException extends Error {
    constructor(message) {
        super(message);
        this.name = "TikTokApiException";
    }
    toString() {
        return this.message;
    }
}
exports.TikTokApiException = TikTokApiException;
class InvalidURLException extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidURLException";
    }
    toString() {
        return this.message;
    }
}
exports.InvalidURLException = InvalidURLException;
class EmptyReponseException extends Error {
    constructor(raw_reponse, message) {
        super(message);
        this.name = "EmptyReponseException";
        this.raw_response = raw_reponse;
    }
    toString() {
        return this.message;
    }
}
exports.EmptyReponseException = EmptyReponseException;
class InvalidJSONException extends Error {
    constructor(raw_reponse, message) {
        super(message);
        this.name = "InvalidJSONException";
        this.raw_response = raw_reponse;
    }
    toString() {
        return this.message;
    }
}
exports.InvalidJSONException = InvalidJSONException;
