// import state from "./util/state.js";
import { buildActionButtons } from "./display/action-buttons.js";
import { buildMainForm } from "./display/form.js";

//get display element
const displayElement = document.getElementById("display-element");

//DEFAULT DISPLAY
export const buildDisplay = async () => {
  if (!displayElement) return null;
  // const { isFirstLoad } = state;

  const actionButtonElement = await buildActionButtons();
  const mainFormElement = await buildMainForm();

  displayElement.append(actionButtonElement, mainFormElement);

  // //build drop down / form on first load
  // if (isFirstLoad) {
  //   const actionButtonElement = await buildActionButtons();
  //   const mainFormElement = await buildMainForm();

  //   displayElement.append(actionButtonElement, mainFormElement);
  //   // console.log("!!!DISPLAY ELEMENT");
  //   // console.log(displayElement);
  // }

  //check if new data is needed [will pass on first load]
  //   const newDataNeeded = await checkNewDataNeeded();
  //   if (!newDataNeeded) {
  //     //if new data not needed, check if hide / unhide data
  //     await checkHideUnhideData();
  //     return null;
  //   }

  //   //get / parse backend data (returns array of objects)
  //   const backendData = await sendToBack(state);
  //   // console.log("!!!BACKEND DATA");
  //   // console.log(backendData);

  //   if (!backendData) {
  //     //ensure below doesnt fuck things
  //     await displayFail();
  //     return true;
  //   }

  //   const backendDataParsed = await buildBackendDisplay(backendData);

  //   //on fail
  //   if (!backendDataParsed) {
  //     await displayFail();
  //     return null;
  //   }

  //   //otherwise append data
  //   displayElement.append(backendDataParsed);

  //   //UPDATE data loaded (also updates active article)
  //   await updateStateDataLoaded(backendData);

  //   console.log("!!!DISPLAY ELEMENT");
  //   console.log(displayElement);

  //   return "#DONE";
};

buildDisplay();
