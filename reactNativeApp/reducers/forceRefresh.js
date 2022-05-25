const forceRefresh = (state = true, action) => {
  switch (action.type) {
    case "FORCE_REFRESH":
      return !state;

    default:
      return state;
  }
};

export default forceRefresh;
