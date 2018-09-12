import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { addHtmlElement } from '../state/actions'
import SidebarOptionsFactory from './SidebarOptionsFactory'
// import '../index.css'

const SidebarContainer = styled.div`
  height: 100vh;
  width: 30vw;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
`

// Receives addHtmlElement() as props, coming from actions
class SidebarController extends Component {
  state = {
    parent_count: 0,
    children_count: 0,
    parentElement: {
      id: this.parent_count,
      type: null,
      // may need to remove this into it's on property on the state object
      children: [],
    },
  }

  createHtmlElement = e => {
    console.log("winnin'")
    this.setState((prevState, state) => ({
      parent_count: ++prevState.parent_count,
    }))
    const values = {
      id: this.state.parent_count,
      type: 'div',
      children: [],
    }
    // pass in this.state.parentElement
    // This will be moved into a separate function
    // so that it may be submitted after all
    // children elements/styles/media queries have
    // been applied.
    this.props.addHtmlElement(values)
  }

  componentDidUpdate() {
    console.log('SidebarController Updated: ', this.state.children_count)
  }

  updateChildrenCount = () => {
    console.log('UPDATE CHILDREN COUNT RUNNING')
    this.setState((prevState, state) => ({
      children_count: ++prevState.children_count,
    }))
  }

  render() {
    console.log('THIS IS HTML ELEMENTS FROM MAPSTATE TO PROPS: ', this.props)
    const { parent_count, children_count } = this.state
    return (
      <SidebarContainer className="sidebarController">
        <SidebarOptionsFactory
          updateChildrenCount={this.updateChildrenCount}
          parentCount={parent_count}
          childrenCount={children_count}
        />
      </SidebarContainer>
    )
  }
}

function mapStateToProps({ html }) {
  console.log('THE STATE IN MAP STATE TO PROPS: ', html)
  return { html }
}

// Already connected this component so just pass addHtmlElement down to SOF and call it
// from there/
export default connect(
  mapStateToProps,
  { addHtmlElement }
)(SidebarController)

/*
*   { 
*     _id: increment_val
*     type: div, 
*     id: null, 
*     styles: (applied via state from redux store's cssStyles), 
*     children: [
*       { child_id: inc_val, parent_id: inc_val, type: div, styles: (applied via state from redux store's cssStyles), children: [] },
*      ]
*    }
**/
