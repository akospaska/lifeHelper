const showCreateGroceryItemModalReducer = (state = 0, action) => {
  switch (action.type) {
    case 'SET_CATEGORYID_AND_OPEN_CREATE_GROCERY_ITEM_MODAL':
      return action.payload

    default:
      return state
  }
}

export default showCreateGroceryItemModalReducer
