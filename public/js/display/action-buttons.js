// import { buildCollapseContainer } from "../util/collapse.js";

//TELEGRAM ACTION BUTTONS
export const buildActionButtons = async () => {
  const telegramActionWrapper = document.createElement("ul");
  telegramActionWrapper.id = "telegram-action-wrapper";
  telegramActionWrapper.className = "wrapper collapse-content";

  //build ACTION BUTTON list items
  const actionButtonsRow1 = await buildActionButtonsRow1();
  const actionButtonsRow2 = await buildActionButtonsRow2();
  const actionButtonsRow3 = await buildActionButtonsRow3();
  const actionButtonsRow4 = await buildActionButtonsRow4();

  telegramActionWrapper.append(actionButtonsRow1, actionButtonsRow2, actionButtonsRow3, actionButtonsRow4);

  // create title element for collapse container
  //   const titleElement = document.createElement("div");
  //   titleElement.textContent = "TELEGRAM ACTIONS";

  //   //build collapse container
  //   const telegramActionCollapseObj = {
  //     titleElement: titleElement,
  //     contentElement: telegramActionWrapper,
  //     isExpanded: true,
  //     className: "telegram-action-wrapper-collapse",
  //     dataAttribute: "telegram-action-header",
  //   };

  //   const telegramActionCollapseContainer = await buildCollapseContainer(telegramActionCollapseObj);

  //   // Apply the wrapper class to the collapse container instead
  //   telegramActionCollapseContainer.className = "wrapper";

  //   return telegramActionCollapseContainer;

  return telegramActionWrapper;
};

export const buildActionButtonsRow1 = async () => {
  const actionButtonsRow1 = document.createElement("li");
  actionButtonsRow1.id = "action-buttons-row-1";
  actionButtonsRow1.className = "action-button-row";

  const getUpdatesButton = document.createElement("button");
  getUpdatesButton.id = "get-updates-action-button";
  getUpdatesButton.className = "action-button";
  getUpdatesButton.setAttribute("data-id", "1");
  getUpdatesButton.textContent = "GET UPDATES";

  const sendMessageButton = document.createElement("button");
  sendMessageButton.id = "send-message-action-button";
  sendMessageButton.className = "action-button";
  sendMessageButton.textContent = "Send Message";

  actionButtonsRow1.append(getUpdatesButton, sendMessageButton);

  return actionButtonsRow1;
};

export const buildActionButtonsRow2 = async () => {
  const actionButtonsRow2 = document.createElement("li");
  actionButtonsRow2.id = "action-buttons-row-2";
  actionButtonsRow2.className = "action-button-row";

  const forwardMessageButton = document.createElement("button");
  forwardMessageButton.id = "forward-message-action-button";
  forwardMessageButton.className = "action-button";
  forwardMessageButton.textContent = "Forward Message";

  const editCaptionButton = document.createElement("button");
  editCaptionButton.id = "edit-caption-action-button";
  editCaptionButton.className = "action-button";
  editCaptionButton.textContent = "Edit Caption";

  actionButtonsRow2.append(forwardMessageButton, editCaptionButton);

  return actionButtonsRow2;
};

export const buildActionButtonsRow3 = async () => {
  const actionButtonsRow3 = document.createElement("li");
  actionButtonsRow3.id = "action-buttons-row-3";
  actionButtonsRow3.className = "action-button-row";

  const forwardAllStoreButton = document.createElement("button");
  forwardAllStoreButton.id = "forward-all-store-action-button";
  forwardAllStoreButton.className = "action-button";
  forwardAllStoreButton.textContent = "Forward ALL Store";

  const captionAllLookupButton = document.createElement("button");
  captionAllLookupButton.id = "caption-all-lookup-action-button";
  captionAllLookupButton.className = "action-button";
  captionAllLookupButton.textContent = "Caption ALL Lookup";

  actionButtonsRow3.append(forwardAllStoreButton, captionAllLookupButton);

  return actionButtonsRow3;
};

export const buildActionButtonsRow4 = async () => {
  const actionButtonsRow4 = document.createElement("li");
  actionButtonsRow4.id = "action-buttons-row-4";
  actionButtonsRow4.className = "action-button-row";

  const uploadPicsButton = document.createElement("button");
  uploadPicsButton.id = "upload-pics-action-button";
  uploadPicsButton.className = "action-button";
  uploadPicsButton.textContent = "Upload Pics";

  const placeholderButton = document.createElement("button");
  placeholderButton.id = "placeholder";
  placeholderButton.className = "action-button hidden";
  placeholderButton.textContent = "Placeholder";

  actionButtonsRow4.append(uploadPicsButton, placeholderButton);

  return actionButtonsRow4;
};
