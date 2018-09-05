import { createStore } from 'redux'
import { combineReducers } from 'redux'
import htmlReducer from './reducers/htmlReducer'
import cssReducer from './reducers/cssReducer'

// The preloaded state from combineReducers is always set
// over state = whatever, from the imported reducers
export const initialState = {
  byId: {},
  allIds: [],
}

const reducer = combineReducers({
  html: htmlReducer,
  css: cssReducer,
})

const store = createStore(reducer)
export default store
