import store from '../index'
import { addHtmlElement, resetState } from '../actions'

const payload = {
  id: 'first-element',
  element_type: 'section',
  children_list: [],
  all_children_ids: [],
}
const payloadTwo = {
  id: 'second-element',
  element_type: 'div',
  children_list: [],
  all_children_ids: [],
}
const childElPayload = {
  id: 'child-element',
  element_type: 'h1',
  children_list: [],
  all_children_ids: [],
}

// Need to utilize UPDATE_HTML_ELEMENT,
// as I'll need to use the parent_id as a target
// so I know which subset of fields on the redux state to update
describe('Reducer', () => {
  afterEach(() => {
    store.dispatch(resetState())
  })

  test('adds an html element', () => {
    store.dispatch(addHtmlElement(payload))
    const state = store.getState()
    expect(state.html.byId[payload.id]).toEqual(payload)
    expect(state.html.allIds[0]).toEqual(payload.id)
  })

  test('adds subsequent html element to state', () => {
    store.dispatch(addHtmlElement(payload))
    store.dispatch(addHtmlElement(payloadTwo))
    const state = store.getState()
    console.log('THE UPDATED STATE AFTER SECOND ADD HTML ELEMENT: ', state.html)
    expect(state.html.byId[payload.id]).toEqual(payload)
    expect(state.html.byId[payloadTwo.id]).toEqual(payloadTwo)
    expect(state.html.allIds.length).toBe(2)
    expect(state.html.allIds[0]).toBe(payload.id)
    expect(state.html.allIds[1]).toBe(payloadTwo.id)
  })
})
