import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import { connect } from 'react-redux'
import { addHtmlElement } from '../state/actions'

const IndexPage = ({ html, addHtmlElement }) => {
  console.log('HTML IN THE INDEX PAGE: ', html)
  console.log('THE FUNC: ', addHtmlElement)
  return (
    <Layout>
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <Link to="/page-2/">Go to page 2</Link>
    </Layout>
  )
}

// export default IndexPage

const mapStateToProps = ({ html }) => {
  return { html }
}

export default connect(
  mapStateToProps,
  { addHtmlElement }
)(IndexPage)
