import store from '../index'
import { addHtmlElement, updateHtmlElement, resetState } from '../actions'

const payload = {
  id: 'first-element',
  parent_id: null,
  element_type: 'section',
  children_list: [],
  all_children_ids: [],
}
const payloadTwo = {
  id: 'second-element',
  parent_id: null,
  element_type: 'div',
  children_list: [],
  all_children_ids: [],
}
const childElPayload = {
  id: 'child-element',
  // How will the refererence be obtained within the
  // react component?
  // Whenever a parent element's view children html
  // button is clicked, it'll be set inside local state
  // so that it may be referenced
  // and checking against redux state when an html element
  // is added. Should be easy to iterate through
  // and determine the parent
  // This id is necessary for UPDATE_HTML_ELEMENT,
  // So that we know which byId object to update.
  parent_id_arr: ['second-element'],
  element_type: 'span',
  children_list: [],
  all_children_ids: [],
}

const grandChildElPayload = {
  id: 'grand-child-element',
  parent_id_arr: ['second-element', 'child-element'],
  element_type: 'div',
  children_list: [],
  all_children_ids: [],
}

const grandGrandChildElPayload = {
  id: 'grand-grand-child-element',
  parent_id_arr: ['second-element', 'child-element', 'grand-child-element'],
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
    expect(state.html.byId[payload.id]).toEqual(payload)
    expect(state.html.byId[payloadTwo.id]).toEqual(payloadTwo)
    expect(state.html.allIds.length).toBe(2)
    expect(state.html.allIds[0]).toBe(payload.id)
    expect(state.html.allIds[1]).toBe(payloadTwo.id)
  })

  test('adds child html element to parent element state', () => {
    store.dispatch(addHtmlElement(payloadTwo))
    store.dispatch(updateHtmlElement(childElPayload))
    const state = store.getState()
    console.log('THIS IS THE STATE RESULT OF ADDING CHILD: ', state.html.byId)
    // expect(state.html.byId[payload.id]).toEqual(payload)
    // expect(state.html.byId[payloadTwo.id]).toEqual(payloadTwo)
    // expect(state.html.allIds.length).toBe(2)
    // expect(state.html.allIds[0]).toBe(payload.id)
    // expect(state.html.allIds[1]).toBe(payloadTwo.id)
  })

  test('adds grandchild html element to parent element state', () => {
    store.dispatch(addHtmlElement(payloadTwo))
    store.dispatch(updateHtmlElement(childElPayload))
    store.dispatch(updateHtmlElement(grandChildElPayload))
    store.dispatch(updateHtmlElement(grandGrandChildElPayload))
    const state = store.getState()
    console.log(
      'THIS IS THE STATE RESULT OF ADDING GRANDCHILD: ',
      state.html.byId
    )
    console.log(
      state.html.byId['second-element'].children_list_byId['child-element']
    )
    console.log(
      state.html.byId['second-element'].children_list_byId['child-element']
        .children_list_byId['grand-child-element']
    )
    // expect(state.html.byId[payload.id]).toEqual(payload)
    // expect(state.html.byId[payloadTwo.id]).toEqual(payloadTwo)
    // expect(state.html.allIds.length).toBe(2)
    // expect(state.html.allIds[0]).toBe(payload.id)
    // expect(state.html.allIds[1]).toBe(payloadTwo.id)
  })
})
