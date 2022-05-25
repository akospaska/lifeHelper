const loginStatusReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_LOGIN_STATUS":
      return action.payload;

    default:
      return state;
  }
};

export default loginStatusReducer;
