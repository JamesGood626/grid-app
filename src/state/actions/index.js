import {
  ADD_HTML_ELEMENT,
  ADD_CSS_STYLES,
  UPDATE_HTML_ELEMENT,
  DELETE_HTML_ELEMENT,
  RESET_STATE,
} from './types'

// How you'll update state from component's
// dispatch(addHtmlElement(payload))
// will need to refer to this link for using AC in children
// not connected to redux state
// https://redux.js.org/api/bindactioncreators

export const addHtmlElement = payload => {
  // add payload onto dispatch with necessary values for updating state.
  return { type: ADD_HTML_ELEMENT, payload }
}

export const updateHtmlElement = payload => {
  // receives identical payload as addHtmlElement w/ the addition of parent_id
  return { type: UPDATE_HTML_ELEMENT, payload }
}

export const deleteHtmlElement = ({ id }) => {
  return { type: DELETE_HTML_ELEMENT, id }
}

export const addCssStyles = values => async dispatch => {
  return { type: ADD_CSS_STYLES }
}

export const resetState = () => {
  // receives identical payload as addHtmlElement
  return { type: RESET_STATE }
}

// export const addCssStyles = values => async dispatch => {
//   dispatch({ type: ADD_CSS_STYLES })
// }
