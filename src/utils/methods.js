export const setDocumentColors = (data) => {
    data.forEach(setting => {
        if (getComputedStyle(document.documentElement).getPropertyValue(`--${setting.key}`)) {
            document.documentElement.style.setProperty(`--${setting.key}`, setting.value);
            document.documentElement.style.setProperty(`--${setting.key}50`, `${setting.value}50`);
        }
    });
};