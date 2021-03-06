import React from 'react'
import { Provider } from 'react-redux'

import store from './src/state'

export const instantiatedStore = store
// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => <Provider store={store}>{element}</Provider>
