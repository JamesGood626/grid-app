import { createStore } from 'redux'
import { combineReducers } from 'redux'
import htmlReducer from './reducers/htmlReducer'
import cssReducer from './reducers/cssReducer'

// The preloaded state from combineReducers is always set
// over state = whatever, from the imported reducers
const stateShape = {
  byId: {},
  allIds: [],
}

const initialState = {
  html: stateShape,
  css: stateShape,
}

const reducer = combineReducers({
  html: htmlReducer,
  css: cssReducer,
})

const store = createStore(reducer, initialState)
export default store
