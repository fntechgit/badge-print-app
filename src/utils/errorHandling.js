import Swal from "sweetalert2";
import { authErrorHandler } from "openstack-uicore-foundation/lib/utils/actions";

export const buildSwalPayload = (title, content, type) => ({ title, html: content, type });
export const buildSwalErrorPayload = (title, content) => buildSwalPayload(title, content, "error");
export const buildSwalWarningPayload = (title, content) => buildSwalPayload(title, content, "warning");

export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}

export const handleCustomError = (error) => {
  if (error instanceof HttpError) {
    const swalPayload = buildSwalErrorPayload(`HTTP Error ${error.statusCode}`, error.message);
    Swal.fire(swalPayload);
  } else if (error instanceof NetworkError) {
    const swalPayload = buildSwalErrorPayload("Network Error", error.message);
    Swal.fire(swalPayload);
  } else {
    console.error("An unexpected error occurred:", error);
  }
}

export const handleCustomErrorAndRethrow = (error) => {
  handleCustomError(error);
  throw error;
}

export const notifyErrorHandler = (payload, callback = null) => (dispatch) => {
  const hasCallback = callback && typeof callback === "function";
  if (payload.httpCode) {
    Swal.fire(payload).then(result => hasCallback && callback());
  } else if (hasCallback)
    callback();
};

export const customAuthErrorHandler = (error, response) => (dispatch) =>
  authErrorHandler(error, response, notifyErrorHandler)(dispatch);
