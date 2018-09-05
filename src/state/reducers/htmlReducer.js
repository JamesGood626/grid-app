import { ADD_HTML_ELEMENT } from '../actions/types'

// const initialState = {
//   byId: {},
//   allIds: [],
// }

// inside of byId: { [id: string]: IHtmlElement }
// Also this is the shape of the action.PAYLOAD.
// interface IHtmlElement {
//  id: string
//  element_type: string
//  children_list: IHtmlElement[]
//  all_children_ids: string[id]
// }

// inside of allIds: string[]
// IHtmlElement id

export default function(state = null, action) {
  switch (action.type) {
    case ADD_HTML_ELEMENT:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...action.payload,
            children_list: {
              ...state[action.payload.id].children_list,
              ...action.payload.children_list,
            },
            all_children_ids: {
              ...state[action.payload.id].all_children_ids,
              ...action.payload.all_children_ids,
            },
          },
        },
        allIds: [...state.allIds, action.payload.id],
      }
    case DELETE_HTML_ELEMENT:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id]: action.payload },
        allIds: [...state.allIds].filter(id => id !== action.id),
      }
    default:
      return state
  }
}
