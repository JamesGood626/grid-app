import { ADD_CSS_STYLES } from '../actions/types'
import { initialState } from '../index'

// So, what's great about this is...
// There's no need for recursion here!
// The user can just select which classes they want to add to their html elements
// interface CSS {
//   class: string,
//   styles: {
//     color: 'blue',
//     height: '100vh'
//   }
//   media: [{
//     breakpoint: '@media (min-width: 600px)',
//     styles: {
//       color: 'green',
//       width: '40vh'
//     }
//   }]
// }

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
