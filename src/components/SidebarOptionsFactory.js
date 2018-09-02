import React, { Component } from "react";
import HtmlOptionsForm from "./SFC/htmlOptionsForm";
import styled from "styled-components";

const Div = styled.div`
  height: 100%;
  width: 100%;
  background: red;
`;

// Receives SidebarController's state as props,
// To use a render prop to dynamically create HTMLOption components
class SidebarOptionsFactory extends Component {
  state = {
    createHtmlElementSubmitted: false,
    childHtmlOptionForms: [],
    parentCssAttributes: {
      parentCssAttributeInputOptionCount: 1,
      styles: {}
    },
    childCssAttributes: [],
    inputsToDeleteByClassName: {}
  };

  componentDidUpdate() {
    const {
      parentCssAttributeInputOptionCount
    } = this.state.parentCssAttributes;
    console.log("COMPONENT UPDATING!!!!!!!!!!!!");
    console.log(
      "THIS IS THE INPUTS TO DELETE ARRAY: ",
      this.state.inputsToDeleteByClassName
    );
    console.log(
      "THE STATE ARRAY FOR CHILD HTML OPTION FORMS: ",
      this.state.childHtmlOptionForms
    );
    console.log(
      "THE PARENT CSS INPUT OPTION COUNT: ",
      this.state.parentCssAttributes.parentCssAttributeInputOptionCount
    );
    console.log(
      "THE CHILD CSS INPUT OPTION COUNT ARRAY: ",
      this.state.childCssAttributes
    );
  }

  renderParentHtmlOptionForm = () => {
    const { parentCount } = this.props;
    const {
      parentCssAttributeInputOptionCount,
      styles
    } = this.state.parentCssAttributes;
    return (
      <HtmlOptionsForm
        passedKey={`parent_${parentCount}`}
        parentId={parentCount}
        userInputStyles={styles}
        parentCssInputOptionCount={parentCssAttributeInputOptionCount}
        addCssInputOption={this.addParentCssAttributeInputOption}
        updateCssStyles={this.updateCssStyles}
      />
    );
  };

  renderChildHtmlOptionBar = () => {
    const { childHtmlOptionForms } = this.state;
    return childHtmlOptionForms.map((childId, i) => {
      const {
        childCssAttributeInputOptionCount,
        styles
      } = this.state.childCssAttributes[i];
      return (
        <HtmlOptionsForm
          passedKey={`child_${childId}`}
          childId={childId}
          childCssInputOptionCount={childCssAttributeInputOptionCount}
          addCssInputOption={this.addChildCssAttributeInputOption}
          updateCssStyles={this.updateCssStyles}
          userInputStyles={styles}
        />
      );
    });
  };

  addChildHtmlOptionForm = () => {
    console.log("The children count before update: ", this.props.childrenCount);
    const { childHtmlInputOptionForms, childCssAttributes } = this.state;
    this.setState((state, prevState) => {
      this.state.childHtmlOptionForms.push(this.props.childrenCount);
      this.state.childCssAttributes.push({
        childCssAttributeInputOptionCount: 1,
        styles: {}
      });
    });
    // invocation of a function declared in SidebarController Component
    // to update it's children_count state, incrementing by 1
    this.props.updateChildrenCount();
  };

  addParentCssAttributeInputOption = (elementId, parentOrChild) => {
    // const elId = elementId;
    // const parOrChi = parentOrChild;
    const SidebarOptionsFactoryThis = this;
    return function(e) {
      e.preventDefault();
      const targetParentToIncrement =
        SidebarOptionsFactoryThis.state.parentCssAttributes;
      const styles = targetParentToIncrement.styles;
      const inputOptionCountAdjustedForArrAccess =
        targetParentToIncrement.parentCssAttributeInputOptionCount - 1;
      const stylesPropertyArr = Object.getOwnPropertyNames(styles);
      // This check is to ensure that a css option has already been selected before
      // adding a new blank input
      if (stylesPropertyArr[inputOptionCountAdjustedForArrAccess]) {
        SidebarOptionsFactoryThis.setState({
          parentCssAttributes: {
            ...SidebarOptionsFactoryThis.state.parentCssAttributes,
            parentCssAttributeInputOptionCount: ++SidebarOptionsFactoryThis
              .state.parentCssAttributes.parentCssAttributeInputOptionCount
          }
        });
      }

      // console.log(
      //   "HERE IS THE PARENT STYLE STATE AFTER UPDATING: ",
      //   SidebarOptionsFactoryThis.state.parentCssAttributes.styles
      // );
      // SidebarOptionsFactoryThis.setState((state, prevState) => {
      //   parentCssAttributes: {
      //     parentCssAttributeInputOptionCount: ++state.parentCssAttributes
      //       .parentCssAttributeInputOptionCount;
      //   }
      // });
      // SOFThis.setState((state, prevState) => {
      //   parentCssAttributes: ++prevState.parentCssAttributes
      //     .parentCssAttributeInputOptionCount;
      // });
      // this.state.parentCssAtrributeInputOption will be shaped as
      // {}
      // this function is called when user clicks the add style button from within
      // the cssStyleOptions SFC -> CssModalDiv
      // this.setState.parentCssAttributes.parentCssAttributeInputOptionCount = ++parentCssAttributeInputOptionCount;
    };
  };

  addChildCssAttributeInputOption = (elementId, parentOrChild) => {
    const SidebarOptionsFactoryThis = this;
    return function(e) {
      // this.state.childCssAttributes will be shaped as
      // [{}, {}, {}]
      // Will parse the id from the childHtmlOptionForms: [], (Not the array itself,
      // but the id is useful because the position of childCssAttributes will match
      // the id that's assigned to the childHtmlOptionForm element that is being clicked).
      // That's how we'll access the object within childCss Attributes, and then increment the
      // childCssAttributeInputOptionCount by one.
      e.preventDefault();

      const targetChildToIncrement =
        SidebarOptionsFactoryThis.state.childCssAttributes[elementId];
      const styles = targetChildToIncrement.styles;
      const inputOptionCountAdjustedForArrAccess =
        targetChildToIncrement.childCssAttributeInputOptionCount - 1;
      const stylesPropertyArr = Object.getOwnPropertyNames(styles);
      // This check is to ensure that a css option has already been selected before
      // adding a new blank input
      if (stylesPropertyArr[inputOptionCountAdjustedForArrAccess]) {
        targetChildToIncrement.childCssAttributeInputOptionCount += 1;
        SidebarOptionsFactoryThis.setState({
          childCssAttributes: [
            ...SidebarOptionsFactoryThis.state.childCssAttributes
          ]
        });
      }
    };
  };

  // Okay so on submit you'd want to target the containing div via:
  // parentCssFormDiv_0, childCssFormDiv_0, childtCssFormDiv_1 ... etc
  // IF there's any errors in the form.

  // This accesses the input value
  // e.currentTarget.children[1].children[1].value
  // this would access the dropdown value
  // e.currentTarget.children[1].children[0].value
  // the var should be all the children from index 1 and up
  // in order to get all of the forms rendered in the div
  // e.currentTarget.children[var].children[1].value

  // document.querySelector the parent parentCssFormDiv_${} and childCssFormDiv_${}
  // if error is detecting in any style object literals during validation.
  // This is primarily to render an error message and apply a class of visibiity: visible;
  // to the div containing the error.
  // This will all happen when the master submit button is clicked.

  // When performing validation of the styles in state
  // parent is easy, access parentCssFormDiv_${parentId} if you need
  // to get access to the children elements using the info in the comment above.
  // the element in the children array(i.e the number used to access it)
  // You'll need the value from the dropDownSelect in order to determine which
  // input contains the error.

  // When performing validation of the styles in state FOR CHILDREN
  // parent is easy, access childCssFormDiv_${positionOfTheObjectIn_childCssAttributes} if you need

  // ALSO, JUST THOUGHT ABOUT IT... NEED TO ENABLE USERS TO REMOVE A DROPDOWNSELECT&INPUT PAIR
  // ALSO, IN ORDER TO PREVENT MULTIPLE SELECTIONS OF

  updateCssStyles = (elementId, parentOrChild) => {
    const SidebarOptionsFactoryThis = this;
    return function(e) {
      // console.log("PAR OR CHI", parentOrChild);
      // console.log("THE ELEMENT ID", elementId);
      // console.log("THE TARGET", e.currentTarget.className);
      // console.log("THE TARGET DIR", e.currentTarget.children);
      // MAY NEED TO BE ADJUSTED TO TARGET CONTAINING DIV
      const elementList = document.getElementsByClassName(e.target.className);
      const targetElementsClassName = e.target.className;
      console.log("THE ELEMENT LIST: ", elementList);
      const selectDropDownOption = elementList[1].value;

      // THE START OF THE DELETION LOGIC.
      // NOW I JUST NEED TO ADD A BUTTON THAT WILL
      // RENDER WHEN this.state.inputsToDeleteByClassName
      // has been updated with a className to target.
      // Add button when the object isn't empty.
      // And then create the function for deleting the html
      // elements + clear their state from the state styles object.
      if (elementList[0].checked) {
        if (
          !SidebarOptionsFactoryThis.state.inputsToDeleteByClassName[
            targetElementsClassName
          ]
        )
          SidebarOptionsFactoryThis.setState({
            inputsToDeleteByClassName: {
              [targetElementsClassName]: true,
              ...SidebarOptionsFactoryThis.state.inputsToDeleteByClassName
            }
          });
      }
      // To ensure that state&input value isn't updated without a select option chosen.
      // Not calling setState here, because when I attempted to do so, it wouldn't trigger
      // a re-render. I can only assume it has something to do with the nested structure of
      // the state.
      if (selectDropDownOption !== "") {
        // Do state updating here.
        if (parentOrChild === "parent") {
          SidebarOptionsFactoryThis.state.parentCssAttributes.styles[
            selectDropDownOption
          ] =
            elementList[1].value;
        } else if (parentOrChild === "child") {
          const targetChildToUpdateStyle =
            SidebarOptionsFactoryThis.state.childCssAttributes[elementId];
          targetChildToUpdateStyle.styles[selectDropDownOption] =
            elementList[1].value;
        }
      } else {
        // the associated input
        // This ensures the user can't type into the
        // input field if a CSS property hasn't been selected
        elementList[2].value = "";
      }
      // console.log(
      //   "THE UPDATED PARENT CSS ATTR STATE: ",
      //   SidebarOptionsFactoryThis.state.parentCssAttributes.styles
      // );
      // console.log(
      //   "THE UPDATED CHILD CSS ATTR STATE: ",
      //   SidebarOptionsFactoryThis.state.childCssAttributes[elementId]
      // );
    };
  };

  render() {
    const { childHtmlOptionForms } = this.state;
    return (
      <Div>
        <button onClick={this.addChildHtmlOptionForm}>Add Child</button>
        {this.renderParentHtmlOptionForm()}
        {childHtmlOptionForms.length > 0 ? (
          this.renderChildHtmlOptionBar()
        ) : null}
      </Div>
    );
    // button RenderedBeneath all the rendered htmlOptions that allows more
    // Html options to be added, for the purposes of adding children html elements
  }
}

export default SidebarOptionsFactory;

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
