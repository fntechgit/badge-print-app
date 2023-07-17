import { doFetch } from '@/utils/utils';

export const getIdFromUserProfileURL = (url) => {
    url.match(/^https:\/\/(?:.*?)\.?roblox\.com\/users\/(\d+)[^]*/);
    return RegExp.$1 || null;
};

export const getRobloxUsernameById = (userId) => {
    return doFetch(`https://users.roproxy.com/v1/users/${userId}`);
}