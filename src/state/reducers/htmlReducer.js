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
        // And honestly, if I utilize a parent_id array (Which I pretty much have to)
        // then doing this won't even be necessary, because I'll already know in advance
        // how many levels I'll need to traverse, so I can keep a counter which will
        // be a parameter to the recurse function.
        // The parent_id array will be maintained in local component state
        // and the stack will be added/removed from as the user clicks forward/back
        // through the HTML element levels. So, that'll be easy to pass into the
        // dispatch function for updateHtmlElement.
        //*******Works but will prolly replace */
        // const parentStateObj = state.byId[parent_id]
        // if (parentStateObj !== 'undefined') {
        //   console.log('THIS SHOULD WORK')
        //   return {
        //     ...state,
        //     byId: {
        //       ...state.byId,
        //       [parent_id]: {
        //         ...parentStateObj,
        //         children_list: [
        //           ...parentStateObj.children_list,
        //           action.payload,
        //         ],
        //         all_children_ids: [
        //           ...parentStateObj.all_children_ids,
        //           action.payload.id,
        //         ],
        //       },
        //     },
        //   }
        // }
        // ************************************/
        // If it's not in the first object, then you'll need to
        // check the children_list, and see if it's in that byId object.
        // And so, on and so forth, until a reference is obtained
        const stack = []
        console.log('THE ACTION.PAYLOAD: ', action.payload)
        const firstParent = action.payload.parent_id_arr[0]
        const htmlElementObj = state.byId[firstParent]
        stack.push(htmlElementObj)
        console.log('THE STACK AFTER FIRST PUSH: ', stack)
        const count = 1
        return recurseToFindTargetHtmlById(
          state,
          action.payload,
          action.payload.parent_id_arr,
          count,
          stack,
          htmlElementObj
        )
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
        payload,
        parent_id_arr,
        count,
        stack,
        htmlElementObj
      ) => {
        // Using count(starting from 2) - 1 to access elements in the array, as I'll need to check
        // against the array length to know when I've reached the target Html element's id.
        // levelOfParentIds accomodates for the shifting the first el from parent_id_arr and adding
        // it to the stack.
        const levelOfParentIds = parent_id_arr.length
        console.log('THE COUNT: ', count)
        console.log('THIS IS THE LEVEL OF PARENT IDS: ', levelOfParentIds)
        if (count === levelOfParentIds) {
          // Looping through the stack of the preceding htmlElementObjects
          // by utilizing a decrementing for loop will occur here.
          // const targetParent = action.payload.parent_id_arr[count - 1]
          // const htmlElementObj = state.byId[targetParent]
          // stack.push(htmlElementObj)
          const reversedStack = reverseArray(stack)
          const updatedStackObjects = reversedStack.reduce(
            (acc, curr, index) => {
              console.log(
                'THIS IS THE reversedStack OBJECTS ARRAY: ',
                reversedStack
              )
              console.log('THIS IS CURR: ', curr)
              console.log('THIS IS THE INDEX: ', index)
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
                    [acc[index - 1].id]: acc[index - 1],
                  },
                  all_children_ids: [...curr.all_children_ids],
                }
              }
              return acc
            },
            {}
          )
          const topLevelByIdObj = updatedStackObjects[levelOfParentIds - 1]
          console.log('THE TOP LEVEL BY ID OBJ: ', topLevelByIdObj)
          return {
            ...state,
            byId: {
              ...state.byId,
              [topLevelByIdObj.id]: topLevelByIdObj,
            },
          }
        }
        // Do the update to the children_list and all_children_ids
        // Then begin the unraveling of the stack by utilizing a decrementing
        // for loop to iterate and update each preceding parent object
        // and finally return.
        // const nextParent = parent_id_arr[count - 1]
        // ********************
        // LEFT OFF HERE
        // *********************
        // AHHH, this is why children list needs to be converted to an object, so that
        // I may access the child's byId object via this.
        // I need to rework this. const htmlElementObj = state.byId[firstParent]
        const nextParent = action.payload.parent_id_arr[count]
        console.log('THIS IS THE StACK BEFORE ACCESSING CHILD OBJ: ', stack)
        htmlElementObj = stack[count - 1].children_list_byId[nextParent]
        console.log(
          'CHILD HTML ELEMENT OBJ TO BE PUSHED TO STACK: ',
          htmlElementObj
        )
        stack.push(htmlElementObj)
        count++
        // Otherwise, push htmlElementObj.
        // oh dear... Just as I began to start writing the above sentence. I realized.
        // Maintaining a list of parent objects, for each level of parent will be beneficial
        // So that you know what level you're on. And can check that level's parent_id
        // against htmlElement.Obj's children_byId. (it's an array now, but this will give me
        // the coveted O(1) look up, that way I can then check the obtained children_byId object
        // for the parent_id...
        return recurseToFindTargetHtmlById(
          state,
          payload,
          parent_id_arr,
          count,
          stack,
          htmlElementObj
        )
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
