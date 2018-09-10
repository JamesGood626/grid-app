import {
  ADD_HTML_ELEMENT,
  ADD_NESTED_HTML_ELEMENT,
  INSERT_PARENT_HTML_ELEMENT,
  DELETE_HTML_ELEMENT,
  RESET_STATE,
} from '../actions/types'
import { initialState } from '../index'
// const initialState = {
//   byId: {}, add a parent_id_arr on this object to facilitate
//             updating the parent's for when the user wants to add
//             a container component.
//             Can still utilize parent_id_arr in the newly added
//             html elements as it's useful, but maybe don't spread it
//             the child's representation in redux state.
//   allIds: [],
// }

// inside of byId: { [id: string]: IHtmlElement }
// Also this is the shape of the action PAYLOAD.
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

const performSwap = (currentParent, targetChildId, payload) => {
  // delete the children which will be swapped
  const byIdObj = currentParent.hasOwnProperty('children_list_byId')
    ? currentParent.children_list_byId
    : currentParent.byId
  console.log('THE byIdObj: ', byIdObj)
  const allIdArr = currentParent.hasOwnProperty('all_children_ids')
    ? currentParent.all_children_ids
    : currentParent.allIds
  console.log('THE allIdArr: ', allIdArr)
  // Spreading the currentParent's children_list_byId and all_children_ids
  // data before removing the old child and adding the new parent as it's new child.
  byIdObj.parent_id_arr = [...byIdObj.parent_id_arr, payload.id]
  payload.children_list_byId = { ...byIdObj }
  payload.all_children_ids = [...allIdArr]
  const childRemovalIndex = allIdArr.indexOf(targetChildId)
  allIdArr.splice(childRemovalIndex, 1)
  byIdObj[payload.id] = payload
  allIdArr.push(payload.id)
}

// No choice but to mutate.
// This gets stuck in an infinite loop...
// And my use of count is not working as I hoped it to.
// Need to determine a better way.
const updateChildrenParentIdArrays = (htmlElementObj, parentId, count) => {
  if (
    htmlElementObj.hasOwnProperty('all_children_ids') &&
    htmlElementObj.all_children_ids.length === 0
  ) {
    return
  }
  // Start with that counter at 0 if default value is null.
  // perform the necessary insert.
  if (htmlElementObj.id !== parentId) {
    console.log('THE htmlElementObj BEFORE splice: ', htmlElementObj)
    htmlElementObj.children_list_byId.parent_id_arr.splice(
      count - 1,
      0,
      parentId
    )
    console.log('THE htmlElementObj after splice: ', htmlElementObj)
  }
  // htmlElementObj.hasOwnProperty('children_list_byId')
  //   ? htmlElementObj.children_list_byId.parent_id_arr.splice(count, 0, parentId)
  //   : htmlElementObj.byId.parent_id_arr.splice(count, 0, parentId)
  // I'll need to utilize a recursive function inside of here. to make this possible.
  const childrenIdArr = htmlElementObj.hasOwnProperty('all_children_ids')
    ? htmlElementObj.all_children_ids
    : htmlElementObj.allIds
  const length = childrenIdArr.length
  // call the recurse function on the currently iterated first level child object obtained from
  // children_list_byId.
  count++
  console.log('THIS IS COUNT: ', count)
  for (let i = 0; i < length; i++) {
    const childId = childrenIdArr[i]
    const nextHtmlElementObj = htmlElementObj.children_list_byId[childId]
    // console.log('The next Html Element Obj: ', nextHtmlElementObj)
    updateChildrenParentIdArrays(nextHtmlElementObj, parentId, count)
  }
}

// The recursive function will have the count receive a default value of null.
// it'll be checked at the top of the function.
// if null, it'll be initialized to zero. if it's typeof int, then it'll be incremented

// For inserting into the array
// where param1 is the insert location
// const arr = [1,2,3,4,5,6]
// arr.splice(2, 0, "new")
// [1, 2, "new", 3, 4, 5, 6]

// Finally, you'll then want to access the last element in the stack(If we're not at root),
// (i.e. reverse the array and start the iteration spread process) so that the lower
// state tree that was updated is.

const iterateForAddNestedHtml = (state, action) => {
  const stack = []
  let targetChildId = null
  if (action.payload.hasOwnProperty('target_child_id')) {
    const { target_child_id } = action.payload
    targetChildId = target_child_id
  }
  const firstParent = action.payload.parent_id_arr[0]
  const htmlElementObj = state.byId[firstParent]
  stack.push(htmlElementObj)
  const count = 1
  return recurseToFindTargetHtmlById(
    action,
    state,
    action.payload,
    action.payload.parent_id_arr,
    count,
    stack,
    htmlElementObj,
    targetChildId
  )
}

const recurseToFindTargetHtmlById = (
  action,
  state,
  payload,
  parent_id_arr,
  count,
  stack,
  htmlElementObj,
  targetChildId
) => {
  const levelOfParentIds = parent_id_arr.length
  if (count === levelOfParentIds) {
    // Reverse is necessary to start from the most recently added parent Html element.
    // as without it, we'd be accessing the most senior parent first in our reduce.
    // Which is useless for what we need to accomplish.
    const reversedStack = reverseArray(stack)
    if (action.type === INSERT_PARENT_HTML_ELEMENT) {
      // then we can do the swapping of positions,
      if (payload.children_list_byId.length === 0) {
        const currentParent = reversedStack[0]
        performSwap(currentParent, targetChildId, payload)
        console.log('Payload after performSwap: ', payload)
      }
      // payload.all_children_ids = [...currentParent]
      // reassign the payload to be the newly updated payload that
      // has the children spread.
      // and delete the children from the old parent.
      // and then the recursion function can be called in here.
      updateChildrenParentIdArrays(payload, payload.id, count)
    }
    const updatedStackObjects = reversedStack.reduce((acc, curr, index) => {
      // if index is zero this is the parent Html element, which we'll
      // update with the children's payload information.
      const previousAccObjectIndex = index - 1
      if (index === 0) {
        acc[index] = {
          ...curr,
          children_list_byId: {
            ...curr.children_list_byId,
            // Since I'm adding this here, I think it could possibly just
            // be desctructured, and not be added to the child's object.
            parent_id_arr: payload.parent_id_arr,
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
            [acc[previousAccObjectIndex].id]: acc[previousAccObjectIndex],
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
    action,
    state,
    payload,
    parent_id_arr,
    count,
    stack,
    htmlElementObj,
    targetChildId
  )
}

// const recurseForAddingContainerHtml = (
//   state,
//   payload,
//   parent_id_arr,
//   count,
//   stack,
//   htmlElementObj
// ) => {
//   // And to accomodate the implementation below, we stop at the last element in the
//   // parent_id_arr, which is the current parent of the child.
//   // THIS IS BEST.
//   // Handling the re-pointer assignment could be as easy as stopping the recursing as soon as
//   // the parent of the element for which we intend to wrap in a parent container in is found;
//   // and then getting reference to the target child's byId object and all_ids string from the array, then
//   // deleting them and spreading them on the parentContainer payload object, which will then be spread onto
//   // the html element object that we just deleted the child information from.

//   // Then, you'll need to traverse through every child below where the parentContainer was added,
//   // and update each of the parent_id_arr on the children_list_byId object.
//   // So due to each child in the child_list_byId having it's own child_list_byId, you'll need to use
//   // all_ids to iterate through the parentContainer's children_list_byId object (And the parent_id_arr should, already
//   // have been taken care of for the parentContainer, as it should be on the payload from the client side.)
//   // And update their parent_id_arr, before again using their all_ids array to iterate through all of the children_list_byIds
//   // yet again, and so on and so forth, until every last child's children_list_byId.parent_id_arr has been updated.
//   // How will I keep track of the index at which I should enter the parent in each of those subsequent children's
//   // children_list_byId.parent_id_arr be kept track of?
//   // Okay, so for the parent_id_arr-traverse-counte for updating parent_id_arrs of the children.
//   // It'll start from zero, after the parentContainer has been inserted.
//   // After the immediate child has had it's parent_id_arr updated with the parent_container.
//   // then the parent_id_arr-traverse-counter will be incremented for the next go round.

//   // Increment this, and then use it to slice(insert)
//   // the new parentContainer id as you iterate though the levels
//   const levelOfParentIds = state.byId.parent_id_arr.length
// }

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
    // iterateForAddNestedHtml checks for action.type within.
    case ADD_NESTED_HTML_ELEMENT:
      return iterateForAddNestedHtml(state, action)
    case INSERT_PARENT_HTML_ELEMENT:
      return iterateForAddNestedHtml(state, action)
    case DELETE_HTML_ELEMENT:
      const keys = Object.keys(state.byId).filter(key => key !== action.id)
      return {
        ...state,
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

// Need to add the case where user want's to wrap an element in a wrapper
// container.
// So, again, in component level state, the level that's currently being
// displayed in the sidebar will be maintained in an array.
// So if we were at the root level, then the array will be empty.
// if we navigate to one of the parent html elements, the array will contain
// that element's id
