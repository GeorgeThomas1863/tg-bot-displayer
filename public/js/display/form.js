import { buildCollapseContainer } from "../util/collapse.js";

//TELEGRAM FORM ELEMENTS
export const buildMainForm = async () => {
  const formWrapper = document.createElement("ul");
  formWrapper.id = "form-wrapper";
  formWrapper.className = "wrapper collapse-content";

  //build FORM list items
  const forwardAllStoreTypeListItem = await buildForwardAllStoreTypeListItem();
  const captionLookupTypeListItem = await buildCaptionLookupTypeListItem();
  const uploadPicTypeListItem = await buildUploadPicTypeListItem();
  const dataTypeListItem = await buildDataTypeListItem();
  const updateIdListItem = await buildUpdateIdListItem();
  const messageIdListItem = await buildMessageIdListItem();
  const chatIdListItem = await buildChatIdListItem();
  const messageStartListItem = await buildMessageStartListItem();
  const messageStopListItem = await buildMessageStopListItem();
  const picPathListItem = await buildPicPathListItem();
  const collectionPullFromListItem = await buildCollectionPullFromListItem();
  const collectionSaveToListItem = await buildCollectionSaveToListItem();
  const editCaptionsChannelListItem = await buildEditCaptionsChannelListItem();
  const forwardFromChatIdListItem = await buildForwardFromChatIdListItem();
  const forwardToChatIdListItem = await buildForwardToChatIdListItem();
  const uploadToListItem = await buildUploadToListItem();
  const commandListItem = await buildCommandListItem();
  const textInputListItem = await buildTextInputListItem();
  const submitButton = await buildSubmitButton();

  formWrapper.append(
    forwardAllStoreTypeListItem,
    captionLookupTypeListItem,
    uploadPicTypeListItem,
    dataTypeListItem,
    updateIdListItem,
    messageIdListItem,
    chatIdListItem,
    messageStartListItem,
    messageStopListItem,
    picPathListItem,
    collectionPullFromListItem,
    collectionSaveToListItem,
    editCaptionsChannelListItem,
    forwardFromChatIdListItem,
    forwardToChatIdListItem,
    uploadToListItem,
    commandListItem,
    textInputListItem,
    submitButton
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

export const buildForwardAllStoreTypeListItem = async () => {
  const forwardAllStoreTypeListItem = document.createElement("li");
  forwardAllStoreTypeListItem.id = "list-item-forward-all-store-type";
  forwardAllStoreTypeListItem.className = "form hidden";

  const forwardAllStoreTypeLabel = document.createElement("label");
  forwardAllStoreTypeLabel.setAttribute("for", "forward-all-store-type-input");
  forwardAllStoreTypeLabel.textContent = "Store TYPE";

  const forwardAllStoreTypeSelect = document.createElement("select");
  forwardAllStoreTypeSelect.id = "forward-all-store-type-input";

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

  const captionLookupTypeSelect = document.createElement("select");
  captionLookupTypeSelect.id = "lookup-type-caption-input";

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

  const uploadPicTypeSelect = document.createElement("select");
  uploadPicTypeSelect.id = "lookup-type-upload-pic-input";

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

export const buildDataTypeListItem = async () => {
  const dataTypeListItem = document.createElement("li");
  dataTypeListItem.id = "list-item-data-type";
  dataTypeListItem.className = "form hidden";

  const dataTypeLabel = document.createElement("label");
  dataTypeLabel.setAttribute("for", "lookup-type-data-input");
  dataTypeLabel.textContent = "Data TYPE";

  const dataTypeInput = document.createElement("input");
  dataTypeInput.type = "text";
  dataTypeInput.name = "data-type-input";
  dataTypeInput.id = "data-type-input";

  dataTypeListItem.append(dataTypeLabel, dataTypeInput);

  return dataTypeListItem;
};

export const buildUpdateIdListItem = async () => {
  const updateIdListItem = document.createElement("li");
  updateIdListItem.id = "list-item-update-id";
  updateIdListItem.className = "form";

  const updateIdLabel = document.createElement("label");
  updateIdLabel.setAttribute("for", "update-id-input");
  updateIdLabel.textContent = "Offset";

  const updateIdInput = document.createElement("input");
  updateIdInput.type = "text";
  updateIdInput.name = "update-id-input";
  updateIdInput.id = "update-id-input";

  updateIdListItem.append(updateIdLabel, updateIdInput);

  return updateIdListItem;
};

export const buildMessageIdListItem = async () => {
  const messageIdListItem = document.createElement("li");
  messageIdListItem.id = "list-item-message-id";
  messageIdListItem.className = "form hidden";

  const messageIdLabel = document.createElement("label");
  messageIdLabel.setAttribute("for", "message-id-input");
  messageIdLabel.textContent = "Message ID";

  const messageIdInput = document.createElement("input");
  messageIdInput.type = "text";
  messageIdInput.name = "message-id-input";
  messageIdInput.id = "message-id-input";

  messageIdListItem.append(messageIdLabel, messageIdInput);

  return messageIdListItem;
};

export const buildChatIdListItem = async () => {
  const chatIdListItem = document.createElement("li");
  chatIdListItem.id = "list-item-chat-id";
  chatIdListItem.className = "form hidden";

  const chatIdLabel = document.createElement("label");
  chatIdLabel.setAttribute("for", "chat-id-input");
  chatIdLabel.textContent = "Chat ID";

  const chatIdInput = document.createElement("input");
  chatIdInput.type = "text";
  chatIdInput.name = "chat-id-input";
  chatIdInput.id = "chat-id-input";

  chatIdListItem.append(chatIdLabel, chatIdInput);

  return chatIdListItem;
};

export const buildMessageStartListItem = async () => {
  const messageStartListItem = document.createElement("li");
  messageStartListItem.id = "list-item-message-start";
  messageStartListItem.className = "form hidden";

  const messageStartLabel = document.createElement("label");
  messageStartLabel.setAttribute("for", "message-start-input");
  messageStartLabel.textContent = "Start Msg ID";

  const messageStartInput = document.createElement("input");
  messageStartInput.type = "text";
  messageStartInput.name = "message-start-input";
  messageStartInput.id = "message-start-input";

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

  const messageStopInput = document.createElement("input");
  messageStopInput.type = "text";
  messageStopInput.name = "message-stop-input";
  messageStopInput.id = "message-stop-input";

  messageStopListItem.append(messageStopLabel, messageStopInput);

  return messageStopListItem;
};

export const buildPicPathListItem = async () => {
  const picPathListItem = document.createElement("li");
  picPathListItem.id = "list-item-pic-path";
  picPathListItem.className = "form hidden";

  const picPathLabel = document.createElement("label");
  picPathLabel.setAttribute("for", "pic-path-input");
  picPathLabel.textContent = "Pic Path";

  const picPathInput = document.createElement("input");
  picPathInput.type = "text";
  picPathInput.name = "pic-path-input";
  picPathInput.id = "pic-path-input";

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

  const collectionPullFromInput = document.createElement("input");
  collectionPullFromInput.type = "text";
  collectionPullFromInput.name = "collection-pull-from-input";
  collectionPullFromInput.id = "collection-pull-from-input";

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

  const collectionSaveToInput = document.createElement("input");
  collectionSaveToInput.type = "text";
  collectionSaveToInput.name = "collection-save-to-input";
  collectionSaveToInput.id = "collection-save-to-input";

  collectionSaveToListItem.append(collectionSaveToLabel, collectionSaveToInput);

  return collectionSaveToListItem;
};

export const buildEditCaptionsChannelListItem = async () => {
  const editCaptionsChannelListItem = document.createElement("li");
  editCaptionsChannelListItem.id = "list-item-edit-captions-channel";
  editCaptionsChannelListItem.className = "form hidden";

  const editCaptionsChannelLabel = document.createElement("label");
  editCaptionsChannelLabel.setAttribute("for", "edit-captions-channel");
  editCaptionsChannelLabel.textContent = "Edit Channel";

  const editCaptionsChannelInput = document.createElement("input");
  editCaptionsChannelInput.type = "text";
  editCaptionsChannelInput.name = "edit-captions-channel";
  editCaptionsChannelInput.id = "edit-captions-channel";

  editCaptionsChannelListItem.append(editCaptionsChannelLabel, editCaptionsChannelInput);

  return editCaptionsChannelListItem;
};

export const buildForwardFromChatIdListItem = async () => {
  const forwardFromChatIdListItem = document.createElement("li");
  forwardFromChatIdListItem.id = "list-item-forward-from-chat-id";
  forwardFromChatIdListItem.className = "form hidden";

  const forwardFromChatIdLabel = document.createElement("label");
  forwardFromChatIdLabel.setAttribute("for", "from-chat-id-input");
  forwardFromChatIdLabel.textContent = "Forward FROM";

  const forwardFromChatIdInput = document.createElement("input");
  forwardFromChatIdInput.type = "text";
  forwardFromChatIdInput.name = "from-chat-id-input";
  forwardFromChatIdInput.id = "from-chat-id-input";

  forwardFromChatIdListItem.append(forwardFromChatIdLabel, forwardFromChatIdInput);

  return forwardFromChatIdListItem;
};

export const buildForwardToChatIdListItem = async () => {
  const forwardToChatIdListItem = document.createElement("li");
  forwardToChatIdListItem.id = "list-item-forward-to-chat-id";
  forwardToChatIdListItem.className = "form hidden";

  const forwardToChatIdLabel = document.createElement("label");
  forwardToChatIdLabel.setAttribute("for", "to-chat-id-input");
  forwardToChatIdLabel.textContent = "Forward TO";

  const forwardToChatIdInput = document.createElement("input");
  forwardToChatIdInput.type = "text";
  forwardToChatIdInput.name = "to-chat-id-input";
  forwardToChatIdInput.id = "to-chat-id-input";

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

  const uploadToInput = document.createElement("input");
  uploadToInput.type = "text";
  uploadToInput.name = "upload-to-input";
  uploadToInput.id = "upload-to-input";

  uploadToListItem.append(uploadToLabel, uploadToInput);

  return uploadToListItem;
};

export const buildCommandListItem = async () => {
  const commandListItem = document.createElement("li");
  commandListItem.id = "list-item-command";
  commandListItem.className = "form hidden";

  const commandLabel = document.createElement("label");
  commandLabel.setAttribute("for", "command-input");
  commandLabel.textContent = "Command";

  const commandInput = document.createElement("input");
  commandInput.type = "text";
  commandInput.name = "command-input";
  commandInput.id = "command-input";
  commandInput.value = "getUpdates";

  commandListItem.append(commandLabel, commandInput);

  return commandListItem;
};

export const buildTextInputListItem = async () => {
  const textInputListItem = document.createElement("li");
  textInputListItem.id = "list-item-text-input";
  textInputListItem.className = "form hidden";

  const textInputLabel = document.createElement("label");
  textInputLabel.setAttribute("for", "text-input");
  textInputLabel.textContent = "Text";

  const textInputTextarea = document.createElement("textarea");
  textInputTextarea.name = "text-input";
  textInputTextarea.id = "text-input";

  textInputListItem.append(textInputLabel, textInputTextarea);

  return textInputListItem;
};

export const buildSubmitButton = async () => {
  const submitButton = document.createElement("button");
  submitButton.id = "submit-button";
  submitButton.textContent = "SUBMIT";

  return submitButton;
};
