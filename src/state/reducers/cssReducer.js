import { ADD_CSS_STYLES } from '../actions/types'

export default function(state = false, action) {
  switch (action.type) {
    case ADD_CSS_STYLES:
      return true
    default:
      return state
  }
}
