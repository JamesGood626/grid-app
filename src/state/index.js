import { createStore } from 'redux'
import { combineReducers } from 'redux'
import htmlReducer from './reducers/htmlReducer'
import cssReducer from './reducers/cssReducer'

const reducer = combineReducers({
  html: htmlReducer,
  css: cssReducer,
})

const initialState = {
  html: false,
  css: false,
}

const store = createStore(reducer, initialState)
export default store
