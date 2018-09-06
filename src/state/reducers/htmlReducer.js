import {
  ADD_HTML_ELEMENT,
  UPDATE_HTML_ELEMENT,
  DELETE_HTML_ELEMENT,
  RESET_STATE,
} from '../actions/types'
import { initialState } from '../index'
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
export default function(state = initialState, action) {
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
      const { parent_id } = action.payload
      const iterateForUpdate = (state, action, parent_id) => {
        const parentStateObj = state.byId[parent_id]
        if (parentStateObj !== 'undefined') {
          console.log('THIS SHOULD WORK')
          return {
            ...state,
            byId: {
              ...state.byId,
              [parent_id]: {
                ...parentStateObj,
                children_list: [
                  ...parentStateObj.children_list,
                  action.payload,
                ],
                all_children_ids: [
                  ...parentStateObj.all_children_ids,
                  action.payload.id,
                ],
              },
            },
          }
        }
        // If it's not in the first object, then you'll need to
        // check the children_list, and see if it's in that byId object.
        // And so, on and so forth, until a reference is obtained

        // It would be easiest, to utilize a recursive function.
        // Which maintains the stack (necessary for keeping track of the parent objects
        // for updating byId after the target element is updated with the new children)
        // Params: state, action, parent_id, stack (list of HtmlElement parent objects), and a reference to the next child
        // HtmlElement to check the byId for the presence of parent_id
        // Utilize a decrementing forloop when unraveling the stack and updating, and
        // finally return the object once the process is complete.
      }
      const recurseToFindTargetHtmlById = (
        state,
        action,
        parent_id,
        stack,
        htmlElementObj
      ) => {
        if (htmlElementObj.byId[parent_id]) {
          // Do the update to the children_list and all_children_ids
          // Then begin the unraveling of the stack by utilizing a decrementing
          // for loop to iterate and update each preceding parent object
          // and finally return.
        }
        // Otherwise, push htmlElementObj.
        // oh dear... Just as I began to start writing the above sentence. I realized.
        // Maintaining a list of parent objects, for each level of parent will be beneficial
        // So that you know what level you're on. And can check that level's parent_id
        // against htmlElement.Obj's children_byId. (it's an array now, but this will give me
        // the coveted O(1) look up, that way I can then check the obtained children_byId object
        // for the parent_id...
      }
      return iterateForUpdate(state, action, action.payload.parent_id)
    // return {
    //   ...state,
    //   byId: {
    //     ...state.byId,
    //     [action.payload.id]: {
    //       ...action.payload,
    //       children_list: {
    //         ...state[action.payload.id].children_list,
    //         ...action.payload.children_list,
    //       },
    //       all_children_ids: {
    //         ...state[action.payload.id].all_children_ids,
    //         ...action.payload.all_children_ids,
    //       },
    //     },
    //   },
    //   allIds: [...state.allIds, action.payload.id],
    // }
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
    case RESET_STATE:
      return initialState
    default:
      return state
  }
}
