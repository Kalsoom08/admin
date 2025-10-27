import CONSTANTS from "@data/Constants";

export const storeInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorageValue = key => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
};

export const removeFromLocalStorage = key => {
  localStorage.removeItem(key);
};

export const storeTokens = data => {
  const { accessToken, refreshToken } = data;
  storeInLocalStorage(CONSTANTS.ACCESS_TOKEN, accessToken);
  storeInLocalStorage(CONSTANTS.REFRESH_TOKEN, refreshToken);
};

export const removeTokens = () => {
  removeFromLocalStorage(CONSTANTS.ACCESS_TOKEN);
  removeFromLocalStorage(CONSTANTS.REFRESH_TOKEN);
};
