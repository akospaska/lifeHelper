export const setForceRefresh = () => {
  return {
    type: 'FORCE_REFRESH',
  }
}
export const setLoginStatus = (loginStatus) => {
  return {
    type: 'SET_LOGIN_STATUS',
    payload: loginStatus,
  }
}

export const setActualToken = (actualToken) => {
  return {
    type: 'SET_ACTUAL_TOKEN',
    payload: actualToken,
  }
}

export const setCreateNewCatGroceryItemAndOpenModal = (categoryId = 0) => {
  return {
    type: 'SET_CATEGORYID_AND_OPEN_CREATE_GROCERY_ITEM_MODAL',
    payload: categoryId,
  }
}
