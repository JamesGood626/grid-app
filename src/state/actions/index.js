import { ADD_HTML_ELEMENT, ADD_CSS_STYLES, DELETE_HTML_ELEMENT } from './types'

// How you'll update state from component's
// dispatch(addHtmlElement(payload))
// will need to refer to this link for using AC in children
// not connected to redux state
// https://redux.js.org/api/bindactioncreators

export const addHtmlElement = payload => {
  // add payload onto dispatch with necessary values for updating state.
  dispatch({ type: ADD_HTML_ELEMENT, payload })
}

export const deleteHtmlElement = ({ id }) => {
  dispatch({ type: DELETE_HTML_ELEMENT, id })
}

export const addCssStyles = values => async dispatch => {
  dispatch({ type: ADD_CSS_STYLES })
}

// export const addCssStyles = values => async dispatch => {
//   dispatch({ type: ADD_CSS_STYLES })
// }
