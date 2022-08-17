export const getIdFromUserProfileURL = (url) => {
    url.match(/^https:\/\/(?:.*?)\.?roblox\.com\/users\/(\d+)[^]*/);
    return RegExp.$1 || null;
};