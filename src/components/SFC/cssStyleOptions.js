import React from 'react'
import styled from 'styled-components'
import HtmlTabOptionsSelector from './htmlTabOptionsSelector'

const CssDiv = styled.div`
  position: relative;
  height: 2rem;
  width: 5rem;
  line-height: 2rem;
  text-align: center;
  margin: 0;
  background: lime;
`

const CssModalDiv = styled.div`
  visibility: hidden;
  position: absolute;
  z-index: 100;
  height: 14.5rem;
  width: 14.5rem;
  background: papayawhip;

  // Selector must be the parent
  ${CssDiv}:hover & {
    visibility: visible;
  }
`

const CssAttributeInputDiv = styled.div`
  display: flex;
  width: 100%;
`

const createNewFilledArray = count => {
  const arr = []
  for (let i = count; i > 0; i--) {
    arr.push(i)
  }
  return arr
}

const cssStyleOptions = ({
  cssOptionCount,
  addCssInputOption,
  updateCssStyles,
  userInputStyles,
  parentId,
  childId,
}) => {
  const arrayForCssInputRendering = createNewFilledArray(cssOptionCount)
  const elementId = typeof parentId === 'number' ? parentId : childId
  const parentOrChild = typeof parentId === 'number' ? 'parent' : 'child'
  const addCssInputOptionEnhanced = addCssInputOption(elementId, parentOrChild)
  const updateCssStylesEnhanced = updateCssStyles(elementId, parentOrChild)
  return (
    <CssDiv>
      Add CSS
      <CssModalDiv
        className={`${parentOrChild}CssFormDiv_${elementId}`}
        onChange={updateCssStylesEnhanced}
      >
        <button onClick={addCssInputOptionEnhanced}>Add Input</button>
        {arrayForCssInputRendering.map((curr, i) => {
          return (
            <CssAttributeInputDiv key={`${curr}_${i}`}>
              <input
                type="checkbox"
                className={`${parentOrChild}CssInputElement_${elementId}_${i}`}
                name="delete"
              />
              <HtmlTabOptionsSelector
                passedClassName={`${parentOrChild}CssInputElement_${elementId}_${i}`}
                optionTitle={'Select CSS Property'}
                options={['background', 'color', 'font-size']}
                userInputStyles={userInputStyles}
                selectionInputId={i}
              />
              <input
                key={i}
                className={`${parentOrChild}CssInputElement_${elementId}_${i}`}
              />
            </CssAttributeInputDiv>
          )
        })}
      </CssModalDiv>
    </CssDiv>
  )
}
// updateCssStyles={updateCssStylesEnhanced}
export default cssStyleOptions
