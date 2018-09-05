import {
  ADD_HTML_ELEMENT,
  UPDATE_HTML_ELEMENT,
  DELETE_HTML_ELEMENT,
} from '../actions/types'
import { access } from 'fs'

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

// The current implementation of add may need to be changed to be UPDATE_HTML_ELEMENTS
export default function(state = null, action) {
  switch (action.type) {
    case ADD_HTML_ELEMENT:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...action.payload,
          },
        },
        allIds: [...state.allIds, action.payload.id],
      }
    case UPDATE_HTML_ELEMENT:
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
      const keys = Object.keys(state.byId).filter(key => key !== action.id)
      return {
        ...state,
        // Indeed, it is a mutation, but the docs
        // haven't shown me the immutablelight.
        byId: keys.reduce((acc, key) => {
          acc[key] = state[key]
          return acc
        }, {}),
        allIds: [...state.allIds].filter(id => id !== action.id),
      }
    default:
      return state
  }
}
