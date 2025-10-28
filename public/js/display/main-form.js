import { buildCollapseContainer } from "../util/collapse.js";

//TELEGRAM FORM ELEMENTS
export const buildMainForm = async () => {
  const formWrapper = document.createElement("ul");
  formWrapper.id = "form-wrapper";
  formWrapper.className = "wrapper collapse-content";

  //build FORM list items
  const offsetListItem = await buildOffsetListItem();
  const chatIdListItem = await buildChatIdListItem();
  const messageIdListItem = await buildMessageIdListItem();
  const dataTypeListItem = await buildDataTypeListItem();

  const commandListItem = await buildCommandListItem();
  const textInputListItem = await buildTextInputListItem();

  const messageStartListItem = await buildMessageStartListItem();
  const messageStopListItem = await buildMessageStopListItem();

  const editCaptionsChannelListItem = await buildEditCaptionsChannelListItem();
  const forwardFromChatIdListItem = await buildForwardFromChatIdListItem();
  const forwardToChatIdListItem = await buildForwardToChatIdListItem();
  const uploadToListItem = await buildUploadToListItem();

  const forwardAllStoreTypeListItem = await buildForwardAllStoreTypeListItem();
  const captionLookupTypeListItem = await buildCaptionLookupTypeListItem();
  const uploadPicTypeListItem = await buildUploadPicTypeListItem();

  const picPathListItem = await buildPicPathListItem();
  const collectionPullFromListItem = await buildCollectionPullFromListItem();
  const collectionSaveToListItem = await buildCollectionSaveToListItem();

  const buttonContainer = await buildButtonContainer();

  formWrapper.append(
    offsetListItem,
    chatIdListItem,
    messageIdListItem,
    dataTypeListItem,
    commandListItem,
    textInputListItem,
    messageStartListItem,
    messageStopListItem,
    editCaptionsChannelListItem,
    forwardFromChatIdListItem,
    forwardToChatIdListItem,
    uploadToListItem,
    forwardAllStoreTypeListItem,
    captionLookupTypeListItem,
    uploadPicTypeListItem,
    picPathListItem,
    collectionPullFromListItem,
    collectionSaveToListItem,
    buttonContainer
  );

  const titleElement = document.createElement("div");
  titleElement.textContent = "TELEGRAM INPUT";

  //build collapse container
  const telegramCollapseObj = {
    titleElement: titleElement,
    contentElement: formWrapper,
    isExpanded: true,
    className: "telegram-wrapper-collapse",
    dataAttribute: "telegram-form-header",
  };

  const telegramCollapseContainer = await buildCollapseContainer(telegramCollapseObj);
  telegramCollapseContainer.id = "form-collapse-container";

  // Apply the wrapper class to the collapse container instead
  telegramCollapseContainer.className = "wrapper";

  return telegramCollapseContainer;
};

export const buildOffsetListItem = async () => {
  const offsetListItem = document.createElement("li");
  offsetListItem.id = "list-item-offset";
  offsetListItem.className = "form";

  const offsetLabel = document.createElement("label");
  offsetLabel.setAttribute("for", "offset-input");
  offsetLabel.textContent = "Offset";
  offsetLabel.className = "form-label";

  const offsetInput = document.createElement("input");
  offsetInput.type = "text";
  offsetInput.name = "offset-input";
  offsetInput.id = "offset-input";
  offsetInput.className = "form-input";

  offsetListItem.append(offsetLabel, offsetInput);

  return offsetListItem;
};

export const buildChatIdListItem = async () => {
  const chatIdListItem = document.createElement("li");
  chatIdListItem.id = "list-item-chat-id";
  chatIdListItem.className = "form hidden";

  const chatIdLabel = document.createElement("label");
  chatIdLabel.setAttribute("for", "chat-id-input");
  chatIdLabel.textContent = "Chat ID";
  chatIdLabel.className = "form-label";

  const chatIdInput = document.createElement("input");
  chatIdInput.type = "text";
  chatIdInput.name = "chat-id-input";
  chatIdInput.id = "chat-id-input";
  chatIdInput.className = "form-input";

  chatIdListItem.append(chatIdLabel, chatIdInput);

  return chatIdListItem;
};

export const buildMessageIdListItem = async () => {
  const messageIdListItem = document.createElement("li");
  messageIdListItem.id = "list-item-message-id";
  messageIdListItem.className = "form hidden";

  const messageIdLabel = document.createElement("label");
  messageIdLabel.setAttribute("for", "message-id-input");
  messageIdLabel.textContent = "Message ID";
  messageIdLabel.className = "form-label";

  const messageIdInput = document.createElement("input");
  messageIdInput.type = "text";
  messageIdInput.name = "message-id-input";
  messageIdInput.id = "message-id-input";
  messageIdInput.className = "form-input";

  messageIdListItem.append(messageIdLabel, messageIdInput);

  return messageIdListItem;
};

export const buildDataTypeListItem = async () => {
  const dataTypeListItem = document.createElement("li");
  dataTypeListItem.id = "list-item-data-type";
  dataTypeListItem.className = "form hidden";

  const dataTypeLabel = document.createElement("label");
  dataTypeLabel.setAttribute("for", "lookup-type-data-input");
  dataTypeLabel.textContent = "Data TYPE";
  dataTypeLabel.className = "form-label";

  const dataTypeInput = document.createElement("input");
  dataTypeInput.type = "text";
  dataTypeInput.name = "data-type-input";
  dataTypeInput.id = "data-type-input";
  dataTypeInput.className = "form-input";

  dataTypeListItem.append(dataTypeLabel, dataTypeInput);

  return dataTypeListItem;
};

export const buildCommandListItem = async () => {
  const commandListItem = document.createElement("li");
  commandListItem.id = "list-item-command";
  commandListItem.className = "form hidden";

  const commandLabel = document.createElement("label");
  commandLabel.setAttribute("for", "command-input");
  commandLabel.textContent = "Command";
  commandLabel.className = "form-label";

  const commandInput = document.createElement("input");
  commandInput.type = "text";
  commandInput.name = "command-input";
  commandInput.id = "command-input";
  commandInput.value = "getUpdates";
  commandInput.className = "form-input";

  commandListItem.append(commandLabel, commandInput);

  return commandListItem;
};

export const buildTextInputListItem = async () => {
  const textInputListItem = document.createElement("li");
  textInputListItem.id = "list-item-text-input";
  textInputListItem.className = "form hidden";

  const textInputLabel = document.createElement("label");
  textInputLabel.setAttribute("for", "text-input");
  textInputLabel.textContent = "Msg Text";
  textInputLabel.className = "form-label";

  const textInputTextarea = document.createElement("textarea");
  textInputTextarea.name = "text-input";
  textInputTextarea.id = "text-input";
  textInputTextarea.className = "form-input";

  textInputListItem.append(textInputLabel, textInputTextarea);

  return textInputListItem;
};

export const buildMessageStartListItem = async () => {
  const messageStartListItem = document.createElement("li");
  messageStartListItem.id = "list-item-message-start";
  messageStartListItem.className = "form hidden";

  const messageStartLabel = document.createElement("label");
  messageStartLabel.setAttribute("for", "message-start-input");
  messageStartLabel.textContent = "Start Msg ID";
  messageStartLabel.className = "form-label";

  const messageStartInput = document.createElement("input");
  messageStartInput.type = "text";
  messageStartInput.name = "message-start-input";
  messageStartInput.id = "message-start-input";
  messageStartInput.className = "form-input";

  messageStartListItem.append(messageStartLabel, messageStartInput);

  return messageStartListItem;
};

export const buildMessageStopListItem = async () => {
  const messageStopListItem = document.createElement("li");
  messageStopListItem.id = "list-item-message-stop";
  messageStopListItem.className = "form hidden";

  const messageStopLabel = document.createElement("label");
  messageStopLabel.setAttribute("for", "message-stop-input");
  messageStopLabel.textContent = "Stop Msg ID";
  messageStopLabel.className = "form-label";

  const messageStopInput = document.createElement("input");
  messageStopInput.type = "text";
  messageStopInput.name = "message-stop-input";
  messageStopInput.id = "message-stop-input";
  messageStopInput.className = "form-input";

  messageStopListItem.append(messageStopLabel, messageStopInput);

  return messageStopListItem;
};

export const buildEditCaptionsChannelListItem = async () => {
  const editCaptionsChannelListItem = document.createElement("li");
  editCaptionsChannelListItem.id = "list-item-edit-captions-channel";
  editCaptionsChannelListItem.className = "form hidden";

  const editCaptionsChannelLabel = document.createElement("label");
  editCaptionsChannelLabel.setAttribute("for", "edit-captions-channel");
  editCaptionsChannelLabel.textContent = "Edit Channel";
  editCaptionsChannelLabel.className = "form-label";

  const editCaptionsChannelInput = document.createElement("input");
  editCaptionsChannelInput.type = "text";
  editCaptionsChannelInput.name = "edit-captions-channel";
  editCaptionsChannelInput.id = "edit-captions-channel";
  editCaptionsChannelInput.className = "form-input";

  editCaptionsChannelListItem.append(editCaptionsChannelLabel, editCaptionsChannelInput);

  return editCaptionsChannelListItem;
};

export const buildForwardFromChatIdListItem = async () => {
  const forwardFromChatIdListItem = document.createElement("li");
  forwardFromChatIdListItem.id = "list-item-forward-from-chat-id";
  forwardFromChatIdListItem.className = "form hidden";

  const forwardFromChatIdLabel = document.createElement("label");
  forwardFromChatIdLabel.setAttribute("for", "from-chat-id-input");
  forwardFromChatIdLabel.textContent = "Fwd FROM";
  forwardFromChatIdLabel.className = "form-label";

  const forwardFromChatIdInput = document.createElement("input");
  forwardFromChatIdInput.type = "text";
  forwardFromChatIdInput.name = "from-chat-id-input";
  forwardFromChatIdInput.id = "from-chat-id-input";
  forwardFromChatIdInput.className = "form-input";
  forwardFromChatIdInput.value = "-1001706757504"; //REMOVE DEFAULT VALUE

  forwardFromChatIdListItem.append(forwardFromChatIdLabel, forwardFromChatIdInput);

  return forwardFromChatIdListItem;
};

export const buildForwardToChatIdListItem = async () => {
  const forwardToChatIdListItem = document.createElement("li");
  forwardToChatIdListItem.id = "list-item-forward-to-chat-id";
  forwardToChatIdListItem.className = "form hidden";

  const forwardToChatIdLabel = document.createElement("label");
  forwardToChatIdLabel.setAttribute("for", "to-chat-id-input");
  forwardToChatIdLabel.textContent = "Fwd TO";
  forwardToChatIdLabel.className = "form-label";

  const forwardToChatIdInput = document.createElement("input");
  forwardToChatIdInput.type = "text";
  forwardToChatIdInput.name = "to-chat-id-input";
  forwardToChatIdInput.id = "to-chat-id-input";
  forwardToChatIdInput.className = "form-input";

  forwardToChatIdListItem.append(forwardToChatIdLabel, forwardToChatIdInput);

  return forwardToChatIdListItem;
};

export const buildUploadToListItem = async () => {
  const uploadToListItem = document.createElement("li");
  uploadToListItem.id = "list-item-upload-to";
  uploadToListItem.className = "form hidden";

  const uploadToLabel = document.createElement("label");
  uploadToLabel.setAttribute("for", "upload-to-input");
  uploadToLabel.textContent = "Upload TO";
  uploadToLabel.className = "form-label";

  const uploadToInput = document.createElement("input");
  uploadToInput.type = "text";
  uploadToInput.name = "upload-to-input";
  uploadToInput.id = "upload-to-input";
  uploadToInput.className = "form-input";

  uploadToListItem.append(uploadToLabel, uploadToInput);

  return uploadToListItem;
};

export const buildForwardAllStoreTypeListItem = async () => {
  const forwardAllStoreTypeListItem = document.createElement("li");
  forwardAllStoreTypeListItem.id = "list-item-forward-all-store-type";
  forwardAllStoreTypeListItem.className = "form hidden";

  const forwardAllStoreTypeLabel = document.createElement("label");
  forwardAllStoreTypeLabel.setAttribute("for", "forward-all-store-type-input");
  forwardAllStoreTypeLabel.textContent = "Store TYPE";
  forwardAllStoreTypeLabel.className = "form-label";

  const forwardAllStoreTypeSelect = document.createElement("select");
  forwardAllStoreTypeSelect.id = "forward-all-store-type-input";
  forwardAllStoreTypeSelect.className = "form-select";

  const optionArray = [
    { value: "storeVids", text: "Store Vids", selected: true },
    { value: "storeEverything", text: "Store Everything" },
    { value: "storeStart", text: "Store Start ID's" },
    { value: "storeBlanks", text: "Store Blank Captions" },
  ];

  for (let i = 0; i < optionArray.length; i++) {
    const optionData = optionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    forwardAllStoreTypeSelect.append(option);
  }

  forwardAllStoreTypeListItem.append(forwardAllStoreTypeLabel, forwardAllStoreTypeSelect);

  return forwardAllStoreTypeListItem;
};

export const buildCaptionLookupTypeListItem = async () => {
  const captionLookupTypeListItem = document.createElement("li");
  captionLookupTypeListItem.id = "list-item-caption-lookup-type";
  captionLookupTypeListItem.className = "form hidden";

  const captionLookupTypeLabel = document.createElement("label");
  captionLookupTypeLabel.setAttribute("for", "lookup-type-caption-input");
  captionLookupTypeLabel.textContent = "Lookup TYPE";
  captionLookupTypeLabel.className = "form-label";

  const captionLookupTypeSelect = document.createElement("select");
  captionLookupTypeSelect.id = "lookup-type-caption-input";
  captionLookupTypeSelect.className = "form-select";

  const optionArray = [
    { value: "setToFileName", text: "Set to Vid File Name", selected: true },
    { value: "clearVidCaptions", text: "CLEAR Vid Captions" },
    { value: "lookupFileName", text: "Lookup File Name" },
    { value: "lookupSpecial", text: "Lookup Special" },
  ];

  for (let i = 0; i < optionArray.length; i++) {
    const optionData = optionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    captionLookupTypeSelect.append(option);
  }

  captionLookupTypeListItem.append(captionLookupTypeLabel, captionLookupTypeSelect);

  return captionLookupTypeListItem;
};

export const buildUploadPicTypeListItem = async () => {
  const uploadPicTypeListItem = document.createElement("li");
  uploadPicTypeListItem.id = "list-item-upload-pic-type";
  uploadPicTypeListItem.className = "form hidden";

  const uploadPicTypeLabel = document.createElement("label");
  uploadPicTypeLabel.setAttribute("for", "lookup-type-upload-pic-input");
  uploadPicTypeLabel.textContent = "Upload TYPE";
  uploadPicTypeLabel.className = "form-label";

  const uploadPicTypeSelect = document.createElement("select");
  uploadPicTypeSelect.id = "lookup-type-upload-pic-input";
  uploadPicTypeSelect.className = "form-select";

  const optionArray = [
    { value: "uploadSingleFS", text: "Upload Pic FS", selected: true },
    { value: "uploadFolderFS", text: "Upload Pic Folder FS" },
    { value: "uploadSingleURL", text: "Upload Pic URL" },
    { value: "uploadListURL", text: "Upload Pic URL List DB" },
    { value: "uploadMultiID", text: "Upload Folder Multi Pic Multi Vid Match ID" },
    { value: "uploadMultiSpecial", text: "Upload Folder Multi Pic Multi Vid Match Special" },
  ];

  for (let i = 0; i < optionArray.length; i++) {
    const optionData = optionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    uploadPicTypeSelect.append(option);
  }

  uploadPicTypeListItem.append(uploadPicTypeLabel, uploadPicTypeSelect);

  return uploadPicTypeListItem;
};

export const buildPicPathListItem = async () => {
  const picPathListItem = document.createElement("li");
  picPathListItem.id = "list-item-pic-path";
  picPathListItem.className = "form hidden";

  const picPathLabel = document.createElement("label");
  picPathLabel.setAttribute("for", "pic-path-input");
  picPathLabel.textContent = "Pic Path";
  picPathLabel.className = "form-label";

  const picPathInput = document.createElement("input");
  picPathInput.type = "text";
  picPathInput.name = "pic-path-input";
  picPathInput.id = "pic-path-input";
  picPathInput.className = "form-input";

  picPathListItem.append(picPathLabel, picPathInput);

  return picPathListItem;
};

export const buildCollectionPullFromListItem = async () => {
  const collectionPullFromListItem = document.createElement("li");
  collectionPullFromListItem.id = "list-item-collection-pull-from";
  collectionPullFromListItem.className = "form hidden";

  const collectionPullFromLabel = document.createElement("label");
  collectionPullFromLabel.setAttribute("for", "collection-pull-from-input");
  collectionPullFromLabel.textContent = "M Pull From";
  collectionPullFromLabel.className = "form-label";

  const collectionPullFromInput = document.createElement("input");
  collectionPullFromInput.type = "text";
  collectionPullFromInput.name = "collection-pull-from-input";
  collectionPullFromInput.id = "collection-pull-from-input";
  collectionPullFromInput.className = "form-input";

  collectionPullFromListItem.append(collectionPullFromLabel, collectionPullFromInput);

  return collectionPullFromListItem;
};

export const buildCollectionSaveToListItem = async () => {
  const collectionSaveToListItem = document.createElement("li");
  collectionSaveToListItem.id = "list-item-collection-save-to";
  collectionSaveToListItem.className = "form hidden";

  const collectionSaveToLabel = document.createElement("label");
  collectionSaveToLabel.setAttribute("for", "collection-save-to-input");
  collectionSaveToLabel.textContent = "M Save To";
  collectionSaveToLabel.className = "form-label";

  const collectionSaveToInput = document.createElement("input");
  collectionSaveToInput.type = "text";
  collectionSaveToInput.name = "collection-save-to-input";
  collectionSaveToInput.id = "collection-save-to-input";
  collectionSaveToInput.className = "form-input";

  collectionSaveToListItem.append(collectionSaveToLabel, collectionSaveToInput);

  return collectionSaveToListItem;
};

export const buildButtonContainer = async () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.id = "button-command-container";

  const submitButton = document.createElement("button");
  submitButton.id = "submit-command-button";
  submitButton.className = "btn-submit";
  submitButton.textContent = "SUBMIT";
  submitButton.setAttribute("data-label", "submit-command");

  const stopButton = document.createElement("button");
  stopButton.id = "stop-command-button";
  stopButton.className = "btn-submit";
  stopButton.textContent = "STOP";
  stopButton.setAttribute("data-label", "stop-command");
  
  buttonContainer.append(submitButton, stopButton);

  return buttonContainer;
};
