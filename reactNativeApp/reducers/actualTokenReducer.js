const actualTokenReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_ACTUAL_TOKEN":
      return action.payload;

    default:
      return state;
  }
};

export default actualTokenReducer;
