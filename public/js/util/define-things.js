export const d = {
  //define action buttons
  getUpdatesActionButton: document.getElementById("get-updates-action-button"),
  sendMessageActionButton: document.getElementById("send-message-action-button"),
  forwardMessageActionButton: document.getElementById("forward-message-action-button"),
  editCaptionActionButton: document.getElementById("edit-caption-action-button"),
  forwardAllStoreActionButton: document.getElementById("forward-all-store-action-button"),
  captionAllLookupActionButton: document.getElementById("caption-all-lookup-action-button"),

  //define submit buttons
  getUpdatesSubmitElement: document.getElementById("get-updates-submit"),
  sendMessageSubmitElement: document.getElementById("send-message-submit"),
  forwardMessageSubmitElement: document.getElementById("forward-message-submit"),
  editCaptionSubmitElement: document.getElementById("edit-caption-submit"),
  forwardAllStoreSubmitElement: document.getElementById("forward-all-store-submit"),
  captionAllLookupSubmitElement: document.getElementById("caption-all-lookup-submit"),
  uploadPicsSubmitElement: document.getElementById("upload-pics-submit"),

  //define form list items
  updateIdListItem: document.getElementById("list-item-update-id"),
  messageIdListItem: document.getElementById("list-item-message-id"),
  chatIdListItem: document.getElementById("list-item-chat-id"),
  messageStartListItem: document.getElementById("list-item-message-start"),
  messageStopListItem: document.getElementById("list-item-message-stop"),
  forwardFromListItem: document.getElementById("list-item-forward-from-chat-id"),
  forwardToListItem: document.getElementById("list-item-forward-to-chat-id"),
  uploadToListItem: document.getElementById("list-item-upload-to"),
  editCaptionChannelListItem: document.getElementById("list-item-edit-captions-channel"),
  picPathListItem: document.getElementById("list-item-pic-path"),
  collectionPullFromListItem: document.getElementById("list-item-collection-pull-from"),
  collectionSaveToListItem: document.getElementById("list-item-collection-save-to"),
  forwardAllStoreTypeListItem: document.getElementById("list-item-forward-all-store-type"),
  captionLookupTypeListItem: document.getElementById("list-item-caption-lookup-type"),
  uploadPicTypeListItem: document.getElementById("list-item-upload-pic-type"),
  commandListItem: document.getElementById("list-item-command"),
  textInputListItem: document.getElementById("list-item-text-input"),

  //define inputs elements
  updateIdElement: document.getElementById("update-id-input"),
  chatIdElement: document.getElementById("chat-id-input"),
  messageIdElement: document.getElementById("message-id-input"),
  messageStartElement: document.getElementById("message-start-input"),
  messageStopElement: document.getElementById("message-stop-input"),
  forwardFromElement: document.getElementById("from-chat-id-input"),
  forwardToElement: document.getElementById("to-chat-id-input"),
  uploadToElement: document.getElementById("upload-to-input"),
  editCaptionsChannelElement: document.getElementById("edit-captions-channel"),
  collectionPullFromElement: document.getElementById("collection-pull-from-input"),
  collectionSaveToElement: document.getElementById("collection-save-to-input"),
  picPathElement: document.getElementById("pic-path-input"),
  commandInputElement: document.getElementById("command-input"),
  textInputElement: document.getElementById("text-input"),

  //define drop down options; forward all drop downs
  forwardAllStoreType: document.getElementById("forward-all-store-type-input"),
  captionLookupTypeInput: document.getElementById("lookup-type-caption-input"),
  uploadPicTypeInput: document.getElementById("lookup-type-upload-pic-input"),

  //define return display and make pretty elements
  sectionReturnWrapper: document.getElementById("data-return-section"),
  dataReturnUpdatesElement: document.getElementById("data-return-element"),
  makePrettyUpdatesElement: document.getElementById("make-pretty-button"),
  undoButtonElement: document.getElementById("undo-button"),
};

//define list item array
export const listItemsButtonsArray = [
  d.updateIdListItem,
  d.messageIdListItem,
  d.chatIdListItem,
  d.messageStartListItem,
  d.messageStopListItem,
  d.forwardFromListItem,
  d.forwardToListItem,
  d.uploadToListItem,
  d.editCaptionChannelListItem,
  d.collectionPullFromListItem,
  d.collectionSaveToListItem,
  d.forwardAllStoreTypeListItem,
  d.captionLookupTypeListItem,
  d.uploadPicTypeListItem,
  d.textInputListItem,
  d.commandListItem,
  d.picPathListItem,
];

export const actionButtonArray = [
  d.getUpdatesActionButton,
  d.sendMessageActionButton,
  d.forwardMessageActionButton,
  d.editCaptionActionButton,
  d.forwardAllStoreActionButton,
  d.captionAllLookupActionButton,
  d.uploadPicsActionButton,
];

export const submitButtonArray = [
  d.getUpdatesActionButton,
  d.getUpdatesSubmitElement,
  d.sendMessageSubmitElement,
  d.forwardMessageSubmitElement,
  d.editCaptionSubmitElement,
  d.forwardAllStoreSubmitElement,
  d.captionAllLookupSubmitElement,
  d.uploadPicsSubmitElement,
];
