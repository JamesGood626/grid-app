import React, { Component } from 'react'
import { connect } from 'react-redux'
// import './index.css'
import { addHtmlElement } from '../state/actions'
import styled from 'styled-components'

// TODO:
// Enable toggle of adding/removing grid lines, with the ability to toggle between
// add/remove rows or columns (add these to a div which has an adjustable z-index for when
// the user toggles on click and drag or resize, so that they may be underneath what the user is
// attempting to drag/resize. Anytime a user clicks and drags an element, that will become an absolutely
// positioned element. Placing items on the grid specifically must be done from the sidebar.)
// Row and column detection to prevent overlap. Perhaps setting a minimum distance for how close they may be
// to each other. Tracking them will need to be done in an array. Keeping track of min/max of
// the placement of the div via it's clientX/clientY. Some use of binary search to find the nearest
// sibling lines?
// Going to need logic that keeps track of how many col/row grid lines are placed and updating that in the
// target section's/div's class in the stylesheet.
// Enable toggle between off, resize, and click and drag of the user's rendered elements

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: #e04;
`

const redHeader = {
  color: 'red',
  height: '4rem',
  width: '4rem',
  background: 'lime',
  margin: '1rem',
}
// Make css grid goodness happen
// Receives htmlElements as props from redux store
class SubDocument extends Component {
  state = {
    style: null,
    mouseDown: false,
    recentTargetBoundingBox: null,
    addGridLines: true,
    removeGridLines: false,
    modifyGridLines: { row: false, column: true },
  }
  componentDidMount = () => {
    const subDocument = this.subDocumentMainContainer.parentNode.parentNode
      .previousSibling.parentNode.parentNode
    console.log(subDocument.body.clientWidth)
    const subDocumentHead = this.subDocumentMainContainer.parentNode.parentNode
      .previousSibling
    const style = document.createElement('style')
    style.appendChild(subDocument.createTextNode(''))

    // Add the <style> element to the page
    subDocumentHead.appendChild(style)

    // **** NOTE: adding rules at the same index in subsequent rules won't overwrite
    // previous rules that were inserted at that index, they'll just take that position
    // and the previous rule will move to the next index. Will need to consider
    // Whether I want to enable the user to specify the order of the rules they select..
    // The default for index is -1, which means the end of the collection.
    // For extra/lazy control, you may add !important to rules to avoid problems with the index.
    style.sheet.insertRule('header { float: left; opacity: 0.8; }', 0)
    style.sheet.insertRule('body { float: left; opacity: 0.8; }', 1)
    // Adding media queries easy breezy
    style.sheet.insertRule(
      '@media (min-width:500px) {.block { float: left; opacity: 0.8; }}',
      1
    )
    this.setState({
      subDocument: subDocument,
      style: style,
    })
    console.log('THE STYLE.SHEET: ', style.sheet)
    // ***** This just returns the body as a string, but really it will suffice for my needs.
    // console.log(subDocument.body.innerHTML);
    // This will return the entire document starting from the doctype tag
    // however there's some encoding issues when you're using fonts in the head
    // as someone on SO mentioned.
    // console.log(new XMLSerializer().serializeToString(subDocument));
  }

  stylePositionPropertyTemplate = (strings, number) => {
    return `${number}${strings[1]}`
  }

  addGridLine = (clientX, clientY) => {
    const {
      modifyGridLines: { row, column },
    } = this.state
    const body = this.state.subDocument.body
    const gridLine = document.createElement('div')
    gridLine.style.position = 'absolute'
    gridLine.style.backgroundColor = 'lime'
    if (column) {
      this.addColumnGridLine(gridLine, clientX)
    } else if (row) {
      this.addRowGridLine(gridLine, clientY)
    }
    body.appendChild(gridLine)
  }

  addColumnGridLine = (gridLine, clientX) => {
    console.log(clientX)
    gridLine.classList.add('columnGridLine_1')
    gridLine.style.top = '0'
    gridLine.style.height = '100vh'
    gridLine.style.width = '2px'
    const styleLeftProperty = this.stylePositionPropertyTemplate`${clientX}px`
    gridLine.style.left = styleLeftProperty
    // this.state.style.sheet.insertRule(".columnGridLine_1 { opacity: 0.5; }", 0);
  }

  addRowGridLine = (gridLine, clientY) => {
    gridLine.classList.add('rowGridLine_1')
    gridLine.style.left = '0'
    gridLine.style.height = '2px'
    gridLine.style.width = '100vw'
    const styleTopProperty = this.stylePositionPropertyTemplate`${clientY}px`
    gridLine.style.top = styleTopProperty
  }

  handleOnClick = e => {
    if (this.state.addGridLines) {
      this.addGridLine(e.clientX, e.clientY)
    } else if (this.state.removeGridLines) {
      if (this.state.modifyGridLines.row) {
        // remove row grid lines
      } else if (this.state.modifyGridLines.column) {
        // remove column grid lines
      }
    }
  }

  handleMouseDown = e => {
    console.log(window.innerWidth)
    console.log(window.innerHeight)
    // console.log("TARGET: ", e.target);
    console.log('Target bounding rect: ', e.target.getBoundingClientRect())
    const targetBoundingBox = e.target.getBoundingClientRect()
    this.setState((prevState, state) => ({
      mouseDown: !prevState.mouseDown,
      recentTargetBoundingBox: targetBoundingBox,
    }))
  }

  handleMouseUp = e => {
    this.setState((prevState, state) => ({
      mouseDown: !prevState.mouseDown,
    }))
  }

  handleMouseMove = e => {
    console.log('the mouse is down: ', this.state.mouseDown)
    if (this.state.mouseDown) {
      console.log('MouseMove clientX: ', e.clientX)
      console.log('MouseMove clientY: ', e.clientY)
      console.log(e.target.offsetLeft)
      console.log(e.target.offsetWidth)

      // This will suffice for resizing...
      e.target.style.width = e.clientX - e.target.offsetLeft + 10 + 'px'
      e.target.style.height = e.clientY - e.target.offsetTop + 10 + 'px'
    }
  }

  handleMouseOut = e => {
    this.setState({
      mouseDown: false,
    })
  }

  renderHtmlElements = () => {
    const keys = Object.getOwnPropertyNames(this.props.htmlElements)
    console.log(keys)
    const elements = keys.map(key => {
      switch (this.props.htmlElements[key].type) {
        case 'div':
          return (
            <div id={key} style={redHeader}>
              Rendering div
            </div>
          )
      }
    })
    return elements
  }
  // What I was rendering before.
  // <div className="container">{this.renderHtmlElements()}</div>;
  render() {
    const styledContainer = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      background: '#e04',
    }
    const styledBlock = {
      height: '10rem',
      width: '10rem',
      background: '#222',
      border: '3px solid #fff',
    }
    return (
      <div
        style={styledContainer}
        ref={x => (this.subDocumentMainContainer = x)}
        // This will be an event listener that is added to every element that the user adds to the
        // subDocument. Which will facilitate getting the dimensions of the div for when
        // they add gridLines, so that calculations may be made and the grid lines readjusted when
        // screen resizing occurs
        // But will each html Element also need a resize event listener? I mean to be able to get
        // access to the grid lines that have been placed.
        onClick={this.handleOnClick}
      >
        <div
          className="block"
          style={styledBlock}
          // className="becomeBlue"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          onMouseOut={this.handleMouseOut}
        />
      </div>
    )
  }
}

function mapStateToProps({ htmlElements }) {
  return { htmlElements }
}

export default connect(
  mapStateToProps,
  { addHtmlElement }
)(SubDocument)
