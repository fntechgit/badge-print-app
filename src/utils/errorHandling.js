import T from "i18n-react/dist/i18n-react";
import Swal from "sweetalert2";

export const buildSwalPayload = (title, content, type) => ({ title, html: content, type });
export const buildSwalErrorPayload = (title, content) => buildSwalPayload(title, content, "error");
export const buildSwalWarningPayload = (title, content) => buildSwalPayload(title, content, "warning");

const isClientError = (error) => {
  const statusCode = error?.res?.statusCode;
  return statusCode >= 400 && statusCode < 500;
};
const isServerError = (error) => error?.res?.statusCode >= 500;
const isNetworkError = (error) => error?.err instanceof Error && !error?.res;

const getClientErrorMessage = (error) => {
  const code = error?.res?.statusCode;
  if (code === 404) {
    const errorKey = error.res.body?.message;
    return T.texts.errors[errorKey] || T.translate(`errors.${code}`);
  } else if (code === 412) {
    const errors = error.res.body?.errors || [];
    let message = "";
    console.log(errors)
    for (const [key, value] of Object.entries(errors)) {
      message += isNaN(key) ? T.texts.errors[key] : "";
      message += `${T.texts.errors[value]}<br/>`;
    }
    return message;
  } else {
    return T.translate(`errors.${code}`) || T.translate("errors.default");
  }
};

const getClientErrorTitle = (error) => {
  const code = error?.res?.statusCode;
  return T.translate(`errors.${code}_title`) || T.translate("errors.default_title");
};

export const alertError = (error) => {
  if (isClientError(error)) {
    const message = getClientErrorMessage(error);
    const title = getClientErrorTitle(error);
    const swalPayload = buildSwalErrorPayload(title, message);
    Swal.fire(swalPayload);
  } else if (isServerError(error)) {
    const swalPayload = buildSwalErrorPayload(T.translate("errors.server_error_title"), T.translate("errors.server_error"));
    Swal.fire(swalPayload);
  } else if (isNetworkError(error)) {
    const swalPayload = buildSwalErrorPayload(T.translate("errors.network_error_title"), error.message || T.translate("errors.network_error"));
    Swal.fire(swalPayload);
  } else {
    console.error("An unexpected error occurred: ", error);
  }
};

export const alertErrorAndRethrow = (error) => {
  alertError(error);
  throw error;
};

export const alertNetworkOrServerErrorAndRethrow = (error) => {
  if (isNetworkError(error) || isServerError(error)) {
    alertError(error);
  }
  throw error;
};

export const handleAuthAlert = (payload, callback = null) => (dispatch) => {
  const hasCallback = callback && typeof callback === "function";
  if (payload.httpCode === 401 || payload.httpCode === 403) {
    Swal.fire(payload).then(result => hasCallback && callback());
  }
};

export const withAlertHandler = (authErrorHandler, alertHandler) => (error, response) => (dispatch) => 
  authErrorHandler(error, response, alertHandler)(dispatch);
