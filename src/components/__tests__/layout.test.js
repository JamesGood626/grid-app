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
    const { debug, getByText, getByTestId, getById, container } = render(
      <Layout />
    )
    const iframe = getByTestId('iframe')
    // Styled components must be obtains via classNames as data-testid doesn't work.
    const sidebarController = container.querySelector('sidebar-controller')
    // debug()
  })
})
