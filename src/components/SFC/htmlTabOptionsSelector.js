import React from 'react'

// PROPS TO PASS FROM SidebarOptionsFactory -> htmlOptionsForm
//  1. array of HTML tag options

// Due to the issue that I had here, I'll need to limit the amount of select/input
// elements that may be created by the user. (if they haven't entered a value, thn they may
// not create another one)

// The method in the above comment will allow me to, ensure that
// the order of the properties in the userInputStyles object, hold
// true to the order, so that when the re-render occurs, the select will
// still be matched with its respective input element.]

const renderOptions = (elementId, optionsArray, userInputStyles) => {
  console.log("HERE'S THE USER INPUT STYLES OBJECT: ", userInputStyles)
  const alreadySelectedCssProperty = Object.getOwnPropertyNames(userInputStyles)
  const firstHtmlOptionsElArr = []
  const selectedProperty = alreadySelectedCssProperty[elementId]
  console.log('THIS IS THE USERINPUTSTYLES: ', userInputStyles)
  if (selectedProperty) {
    firstHtmlOptionsElArr.push(
      <option value={selectedProperty} selected="selected">
        {selectedProperty}
      </option>
    )
  }
  const filteredOptionsArray = optionsArray.filter(option => {
    if (userInputStyles.hasOwnProperty(option)) {
      return false
    }
    return true
  })
  const secondHtmlOptionElArr = filteredOptionsArray.map((option, i) => {
    return (
      <option key={`${option}_${i}`} value={option}>
        {option}
      </option>
    )
  })
  return firstHtmlOptionsElArr.length > 0
    ? firstHtmlOptionsElArr.concat(secondHtmlOptionElArr)
    : secondHtmlOptionElArr
}

const htmlTabOptionsSelector = ({
  updateCssStyles,
  passedClassName,
  optionTitle,
  options,
  userInputStyles,
  selectionInputId,
}) => {
  return (
    <select
      className={passedClassName ? passedClassName : null}
      onChange={updateCssStyles}
    >
      <option value="">{optionTitle}</option>
      {renderOptions(selectionInputId, options, userInputStyles)}
    </select>
  )
}

export default htmlTabOptionsSelector
