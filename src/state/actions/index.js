import { ADD_HTML_ELEMENT, ADD_CSS_STYLES } from './types'

export const addHtmlElement = values => async dispatch => {
  dispatch({ type: ADD_HTML_ELEMENT })
}

export const addCssStyles = values => async dispatch => {
  dispatch({ type: ADD_CSS_STYLES })
}
