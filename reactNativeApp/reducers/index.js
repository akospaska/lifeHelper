import { combineReducers } from 'redux'
import showCreateGroceryItemModalReducer from './showCreateGroceryItemModalReducer'

import forceRefresh from './forceRefresh'
import loginStatusReducer from './loginStatusReducer'

const allReducers = combineReducers({
  forceRefresh: forceRefresh,
  loginStatus: loginStatusReducer,
  showCreateCatSetId: showCreateGroceryItemModalReducer,
})
export default allReducers
