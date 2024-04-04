import React, { useState } from 'react';
import {getAccessToken} from 'openstack-uicore-foundation/lib/security/methods'
import { initLogOut} from 'openstack-uicore-foundation/lib/security/methods';

export const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
};

export const doFetch = async (url) => {
    return fetch(url)
        .then((response) => {
        if (response.ok) {
            const contentType = response.headers.get('Content-Type') || '';
            if (contentType.includes('application/json')) {
                return response.json().catch((e) => {
                    return Promise.reject(
                        new Error('Invalid JSON: ' + e.message)
                    );
                });
            }
            if (contentType.includes('text/html')) {
                return response
                    .text()
                    .then((html) => {
                        return {
                            page_type: 'generic',
                            html: html,
                        };
                    })
                    .catch((e) => {
                        return Promise.reject(
                            new Error('HTML error: ' + e.message)
                        );
                    });
            }
            return Promise.reject(
                new Error('Invalid content type: ' + contentType)
            );
        }
        if (response.status == 404) {
            return Promise.reject(new Error('Page not found: ' + url));
        }
        return Promise.reject(new Error('HTTP error: ' + response.status));
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
        console.log('log out: ', e);
        initLogOut();
    }
};

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
        },
    }
}