import React, { useState } from 'react';

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