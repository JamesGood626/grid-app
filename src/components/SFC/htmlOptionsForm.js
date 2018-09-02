import React from 'react'
import styled from 'styled-components'
import HtmlTabOptionsSelector from './htmlTabOptionsSelector'
import CssStyleOptions from './cssStyleOptions'

const Form = styled.form`
  height: 5rem;
  width: 100%;
  margin-bottom: 0.5rem;
  background: blue;
`

// const showCssModalDiv = {
//   visibility: "visible"
// };

// Receives functions to update SidebarController's state
// based upon user's actions

const htmlOptionsForm = ({
  parentId,
  childId,
  passedKey,
  parentCssInputOptionCount,
  childCssInputOptionCount,
  addCssInputOption,
  updateCssStyles,
  userInputStyles,
}) => {
  const cssOptionCount = parentCssInputOptionCount
    ? parentCssInputOptionCount
    : childCssInputOptionCount
  return (
    <Form
      key={passedKey}
      id={
        typeof parentId === 'number' ? `parent_${parentId}` : `child_${childId}`
      }
    >
      <HtmlTabOptionsSelector
        optionTitle={'HTML Element Type'}
        options={['one', 'two', 'three']}
        userInputStyles={userInputStyles}
      />
      <CssStyleOptions
        cssOptionCount={cssOptionCount}
        addCssInputOption={addCssInputOption}
        updateCssStyles={updateCssStyles}
        userInputStyles={userInputStyles}
        parentId={parentId}
        childId={childId}
      />
      <button>Submit</button>
    </Form>
  )
}

export default htmlOptionsForm
