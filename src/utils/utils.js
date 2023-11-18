import React, { useState } from "react";
import { getAccessToken } from "openstack-uicore-foundation/lib/security/methods"
import { initLogOut } from "openstack-uicore-foundation/lib/security/methods";

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

export const retryRequest = async (
  request,
  maxRetries = MAX_RETRIES,
  baseDelay = BASE_DELAY,
) => {
  for (let retries = 1; retries <= maxRetries; retries++) {
    const delay = baseDelay * 2 ** retries; // exponential backoff
    console.log(`Retrying in ${delay} ms (${retries}/${maxRetries})...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      return await request();
    } catch (error) {
      console.error(`API request error: ${error.err}`);
      if (error.err.status) throw error;
    }
  }
  console.error("Max retries reached. Unable to complete the API request.");
  throw new Error("Max retries reached.");
};

export const retryNetworkError = async (
  request,
  maxRetries = MAX_RETRIES,
  baseDelay = BASE_DELAY,
  retryInBackground = false,
) => {
  try {
    return await request();
  } catch (error) {
    console.error(`API request error: ${error.err}`);
    // if http error is known, throw
    if (error.err.status) throw error;
    // if its a network error and retryInBackground, first resolve and then keep trying
    if (!error.err.status && retryInBackground) {
      const backgroundRetry = retryRequest(request, maxRetries, baseDelay);
      return Promise.race([Promise.resolve(), backgroundRetry]);
    }
    // if its a network error and !retryInBackground, keep trying
    return retryRequest(request, maxRetries, baseDelay);
  }
};

export const retryNetworkErrorInBackground = async (
  request,
  maxRetries = MAX_RETRIES,
  baseDelay = BASE_DELAY,
) => retryNetworkError(request, maxRetries, baseDelay, true);
