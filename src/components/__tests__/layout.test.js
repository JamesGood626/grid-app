import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from 'react-testing-library'
import Layout from '../layout'

describe('Layout', () => {
  afterEach(cleanup)

  test('renders correctly', () => {
    const { debug, getByText, getByTestId, container } = render(<Layout />)
    const iframe = getByTestId('iframe')
    debug()
  })
})
