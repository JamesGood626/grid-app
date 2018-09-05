import { ADD_CSS_STYLES } from '../actions/types'

export default function(state = null, action) {
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
