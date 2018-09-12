import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
// import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import './layout.css'

import { Provider } from 'react-redux'
// import store from '../state'
import { instantiatedStore } from '../../wrap-with-provider'
import SubDocument from './SubDocument'
import SidebarController from './SidebarController'

const MainContainer = styled.section`
  display: flex;
  overflow: hidden;
  margin: 0;
  background: lime;
`

const IFrame = styled.iframe`
  height: 100vh;
  width: 100%;
`

// React.SFC
// This is where I render a second react app into
// the iframe that's in the App class's render func
const initGridPlayGround = iFrame => {
  // const store = storeFromProps ? storeFromProps : instantiatedStore
  ReactDOM.render(
    <Provider store={instantiatedStore}>
      <SubDocument />
    </Provider>,
    iFrame.contentWindow.document.getElementById('subDocument')
  )
}

class Layout extends Component {
  componentDidMount() {
    console.log('THIS IS THE APP STORE: ', instantiatedStore)
    const iFrame = document.getElementById('frame')
    // const storeFromProps = this.props.instantiatedStore
    //  ? this.props.instantiatedStore
    //  : null
    setTimeout(() => {
      if (iFrame.contentWindow.document.readyState === 'complete') {
        initGridPlayGround(iFrame)
      }
    }, 1000)
  }

  render() {
    return (
      <>
        <Helmet
          title={'title'}
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        >
          <html lang="en" />
        </Helmet>
        <MainContainer>
          <SidebarController
            className="sidebar-controller"
            store={instantiatedStore}
          />
          <IFrame
            id="frame"
            data-testid="iframe"
            frameBorder="0"
            srcDoc="<!DOCTYPE html><html><head></head><body><div id='subDocument'></div></body></html>"
            height="100%"
            width="100%"
          />
        </MainContainer>
      </>
    )
  }
}

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// }

export default Layout

// const Layout = ({ children }) => (
//   <StaticQuery
//     query={graphql`
//       query SiteTitleQuery {
//         site {
//           siteMetadata {
//             title
//           }
//         }
//       }
//     `}
//     render={data => (
//       <>
//         <Helmet
//           title={data.site.siteMetadata.title}
//           meta={[
//             { name: 'description', content: 'Sample' },
//             { name: 'keywords', content: 'sample, something' },
//           ]}
//         >
//           <html lang="en" />
//         </Helmet>
//         <Header siteTitle={data.site.siteMetadata.title} />
//         <div
//           style={{
//             margin: '0 auto',
//             maxWidth: 960,
//             padding: '0px 1.0875rem 1.45rem',
//             paddingTop: 0,
//           }}
//         >
//           {children}
//         </div>
//       </>
//     )}
//   />
// )
