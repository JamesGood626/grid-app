import { ADD_HTML_ELEMENT } from '../actions/types'

export default function(state = false, action) {
  switch (action.type) {
    case ADD_HTML_ELEMENT:
      return true
    default:
      return state
  }
}
