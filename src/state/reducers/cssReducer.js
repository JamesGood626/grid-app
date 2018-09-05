import { ADD_CSS_STYLES } from '../actions/types'
import { initialState } from '../index'

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_CSS_STYLES:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id]: action.payload },
        allIds: [...state.allIds, action.payload.id],
      }
    default:
      return state
  }
}
