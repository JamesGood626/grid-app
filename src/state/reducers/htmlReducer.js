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
//  children_list_byId: IHtmlElement {}
//  all_children_ids: string[id]
// }

// inside of allIds: string[]
// IHtmlElement id

const reverseArray = arr => {
  const length = arr.length
  const reversedArray = []
  for (let i = length - 1; i >= 0; i--) {
    reversedArray.push(arr[i])
  }
  return reversedArray
}

const iterateForUpdate = (state, action, parent_id) => {
  const stack = []
  const firstParent = action.payload.parent_id_arr[0]
  const htmlElementObj = state.byId[firstParent]
  stack.push(htmlElementObj)
  const count = 1
  return recurseToFindTargetHtmlById(
    state,
    action.payload,
    action.payload.parent_id_arr,
    count,
    stack,
    htmlElementObj
  )
}
const recurseToFindTargetHtmlById = (
  state,
  payload,
  parent_id_arr,
  count,
  stack,
  htmlElementObj
) => {
  const levelOfParentIds = parent_id_arr.length
  console.log('THE COUNT: ', count)
  console.log('THIS IS THE LEVEL OF PARENT IDS: ', levelOfParentIds)
  if (count === levelOfParentIds) {
    // Reverse is necessary to start from the most recently added parent Html element.
    // as without it, we'd be accessing the most senior parent first in our reduce.
    // Which is useless for what we need to accomplish.
    const reversedStack = reverseArray(stack)
    const updatedStackObjects = reversedStack.reduce((acc, curr, index) => {
      // if index is zero this is the parent Html element, which we'll
      // update with the children's payload information.
      if (index === 0) {
        acc[index] = {
          ...curr,
          children_list_byId: {
            ...curr.children_list_byId,
            [payload.id]: payload,
          },
          all_children_ids: [...curr.all_children_ids, payload.id],
        }
      } else {
        acc[index] = {
          ...curr,
          children_list_byId: {
            ...curr.children_list_byId,
            // adding the result of the previous updated object
            // to it's Html parent children_list_byId object.
            [acc[index - 1].id]: acc[index - 1],
          },
          all_children_ids: [...curr.all_children_ids],
        }
      }
      return acc
    }, {})
    // Grabs the last updatedObject in the array, as that will contain the entire updated
    // "state tree" from our adding the new child Html element.
    const topLevelByIdObj = updatedStackObjects[levelOfParentIds - 1]
    return {
      ...state,
      byId: {
        ...state.byId,
        [topLevelByIdObj.id]: topLevelByIdObj,
      },
    }
  }
  // We haven't reached the target parent Html element yet,
  // so we continue to add each preceding parent object to the stack.
  const nextParent = payload.parent_id_arr[count]
  htmlElementObj = stack[count - 1].children_list_byId[nextParent]
  stack.push(htmlElementObj)
  count++
  return recurseToFindTargetHtmlById(
    state,
    payload,
    parent_id_arr,
    count,
    stack,
    htmlElementObj
  )
}

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
      return iterateForUpdate(state, action, action.payload.parent_id)
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
