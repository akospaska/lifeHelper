export const setForceRefresh = () => {
  return {
    type: "FORCE_REFRESH",
  };
};
export const setLoginStatus = (loginStatus) => {
  return {
    type: "SET_LOGIN_STATUS",
    payload: loginStatus,
  };
};

export const setActualToken = (actualToken) => {
  return {
    type: "SET_ACTUAL_TOKEN",
    payload: actualToken,
  };
};
