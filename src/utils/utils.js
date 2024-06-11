import React, { useState } from "react";
import T from "i18n-react/dist/i18n-react";
import {
  getAccessToken,
  initLogOut
} from "openstack-uicore-foundation/lib/security/methods";
import {
  createAction,
  startLoading,
  stopLoading
} from "openstack-uicore-foundation/lib/utils/actions";

export const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
};

export const doFetch = async (url) => {
  return fetch(url)
    .then((response) => {
    if (response.ok) {
      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        return response.json().catch((e) => {
          return Promise.reject(
            new Error("Invalid JSON: " + e.message)
          );
        });
      }
      if (contentType.includes("text/html")) {
        return response
          .text()
          .then((html) => {
            return {
              page_type: "generic",
              html: html,
            };
          })
          .catch((e) => {
            return Promise.reject(
              new Error("HTML error: " + e.message)
            );
          });
      }
      return Promise.reject(
        new Error("Invalid content type: " + contentType)
      );
    }
    if (response.status == 404) {
      return Promise.reject(new Error("Page not found: " + url));
    }
    return Promise.reject(new Error("HTTP error: " + response.status));
  })
  .catch((e) => {
    return Promise.reject(e);
  });
}

export const getAccessTokenSafely = async (accessTokenQS) => {
  try {
    return await getAccessToken();
  }
  catch (e) {
    if (accessTokenQS) return accessTokenQS;
    console.log("log out: ", e);
    initLogOut();
  }
};

const MAX_RETRIES = 5;
const BASE_DELAY = 1000;

export const retryRequest = (
  request,
  maxRetries = MAX_RETRIES,
  baseDelay = BASE_DELAY,
  inBackground = false,
) => async (dispatch) => {
  let lastError;
  for (let retries = 1; retries <= maxRetries; retries++) {
    const delay = baseDelay * 2 ** retries; // exponential backoff
    console.log(`Retrying in ${delay} ms (${retries}/${maxRetries})...`);
    if (!inBackground) dispatch(startLoading());
    await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      const response = await request();
      if (!inBackground) dispatch(stopLoading());
      return response;
    } catch (error) {
      // if http error is known, throw
      if (error.err.status) {
        console.error(`API request error: ${error.err}`);
        throw error;
      }
      // if its a network error, save last
      lastError = error
    }
  }
  if (!inBackground) dispatch(stopLoading());
  lastError.message = T.translate("errors.max_retries_error");
  console.error(lastError);
  throw lastError;
};

export const retryOnNetworkError = (
  request,
  maxRetries = MAX_RETRIES,
  baseDelay = BASE_DELAY,
  retryInBackground = false,
) => async (dispatch) => {
  try {
    return await request();
  } catch (error) {
    // if http error is known, throw
    if (error.err.status) {
      console.error(`API request error: ${error.err}`);
      throw error;
    }
    // if its a network error and retryInBackground, first resolve and then keep trying
    if (!error.err.status && retryInBackground) {
      const backgroundRetry = retryRequest(request, maxRetries, baseDelay, retryInBackground)(dispatch);
      return Promise.race([Promise.resolve(), backgroundRetry]);
    }
    // if its a network error and !retryInBackground, keep trying
    return retryRequest(request, maxRetries, baseDelay)(dispatch);
  }
};

export const retryInBackgroundOnNetworkError = (
  request,
  maxRetries = MAX_RETRIES,
  baseDelay = BASE_DELAY,
) => async (dispatch) => retryOnNetworkError(request, maxRetries, baseDelay, true)(dispatch);

export const getMarketingBadgeSettings = (marketingSettings) => {
  const background = marketingSettings.filter(m => m.key === "BADGE_TEMPLATE_BACKGROUND_IMG")[0];
  const firstnameColor = marketingSettings.filter(m => m.key === "BADGE_TEMPLATE_FIRST_NAME_COLOR")[0];
  const lastnameColor = marketingSettings.filter(m => m.key === "BADGE_TEMPLATE_LAST_NAME_COLOR")[0];
  const companyColor = marketingSettings.filter(m => m.key === "BADGE_TEMPLATE_COMPANY_COLOR")[0];
  return {
    background: {
      file: background?.file,
      type: background?.type,
      value: background?.value
    },
    firstnameColor: {
      type: firstnameColor?.type,
      value: firstnameColor?.value
    },
    lastnameColor: {
      type: lastnameColor?.type,
      value: lastnameColor?.value
    },
    companyColor: {
      type: companyColor?.type,
      value: companyColor?.value
    }
  }
};
