import store from '../index'
import { addHtmlElement, updateHtmlElement, resetState } from '../actions'

const payload = {
  id: 'first-element',
  parent_id: [],
  element_type: 'section',
  children_list: [],
  all_children_ids: [],
}
const payloadTwo = {
  id: 'second-element',
  parent_id: [],
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

  test('adds a single child html element to parent element state', () => {
    store.dispatch(addHtmlElement(payload))
    store.dispatch(addHtmlElement(payloadTwo))
    store.dispatch(updateHtmlElement(childElPayload))
    const state = store.getState()
    const parentObj = state.html.byId[payloadTwo.id]
    const childObj = parentObj.children_list_byId[childElPayload.id]
    expect(state.html.allIds.length).toBe(2)
    // Parent state tree test
    expect(parentObj.id).toBe(payloadTwo.id)
    expect(parentObj.element_type).toBe(payloadTwo.element_type)
    expect(parentObj.parent_id).toBe(payloadTwo.parent_id)
    expect(parentObj.all_children_ids.length).toBe(1)
    expect(parentObj.all_children_ids[0]).toBe(childElPayload.id)
    // Child state tree test
    expect(childObj.id).toBe(childElPayload.id)
    expect(childObj.parent_id_arr.length).toBe(1)
    expect(childObj.parent_id_arr[0]).toBe(payloadTwo.id)
    expect(childObj.element_type).toBe(childElPayload.element_type)
    expect(childObj.all_children_ids.length).toBe(0)
  })

  test('adds grand grand child html element to parent element state', () => {
    store.dispatch(addHtmlElement(payload))
    store.dispatch(addHtmlElement(payloadTwo))
    store.dispatch(updateHtmlElement(childElPayload))
    store.dispatch(updateHtmlElement(grandChildElPayload))
    store.dispatch(updateHtmlElement(grandGrandChildElPayload))
    const state = store.getState()
    const parentObj = state.html.byId[payloadTwo.id]
    const childObj = parentObj.children_list_byId[childElPayload.id]
    const grandChildObj = childObj.children_list_byId[grandChildElPayload.id]
    const grandGrandChildObj =
      grandChildObj.children_list_byId[grandGrandChildElPayload.id]
    expect(state.html.allIds.length).toBe(2)
    // Parent state tree test
    expect(parentObj.id).toBe(payloadTwo.id)
    expect(parentObj.element_type).toBe(payloadTwo.element_type)
    expect(parentObj.parent_id).toBe(payloadTwo.parent_id)
    expect(parentObj.all_children_ids.length).toBe(1)
    expect(parentObj.all_children_ids[0]).toBe(childElPayload.id)
    // Child state tree test
    expect(childObj.id).toBe(childElPayload.id)
    expect(childObj.parent_id_arr.length).toBe(1)
    expect(childObj.parent_id_arr[0]).toBe(payloadTwo.id)
    expect(childObj.element_type).toBe(childElPayload.element_type)
    expect(childObj.all_children_ids.length).toBe(1)
    expect(childObj.all_children_ids[0]).toBe(grandChildElPayload.id)
    // Grand Child state tree test
    expect(grandChildObj.id).toBe(grandChildElPayload.id)
    expect(grandChildObj.parent_id_arr.length).toBe(2)
    expect(grandChildObj.parent_id_arr[0]).toBe(payloadTwo.id)
    expect(grandChildObj.parent_id_arr[1]).toBe(childElPayload.id)
    expect(grandChildObj.element_type).toBe(grandChildElPayload.element_type)
    expect(grandChildObj.all_children_ids.length).toBe(1)
    expect(grandChildObj.all_children_ids[0]).toBe(grandGrandChildObj.id)
    // And finally, the Grand Grand Child state tree test
    expect(grandGrandChildObj.id).toBe(grandGrandChildElPayload.id)
    expect(grandGrandChildObj.parent_id_arr.length).toBe(3)
    expect(grandGrandChildObj.parent_id_arr[0]).toBe(payloadTwo.id)
    expect(grandGrandChildObj.parent_id_arr[1]).toBe(childElPayload.id)
    expect(grandGrandChildObj.parent_id_arr[2]).toBe(grandChildElPayload.id)
    expect(grandGrandChildObj.element_type).toBe(
      grandGrandChildElPayload.element_type
    )
    expect(grandGrandChildObj.all_children_ids.length).toBe(0)
  })
})
