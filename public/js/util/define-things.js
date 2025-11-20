const d = {
  //define form list items
  offsetListItem: document.getElementById("list-item-offset"),
  messageIdListItem: document.getElementById("list-item-message-id"),
  chatIdListItem: document.getElementById("list-item-chat-id"),
  dataTypeListItem: document.getElementById("list-item-data-type"),
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

  //define return display and make pretty elements
  sectionReturnWrapper: document.getElementById("data-return-section"),
  dataReturnUpdatesElement: document.getElementById("data-return-element"),
  makePrettyUpdatesElement: document.getElementById("make-pretty-button"),
  undoButtonElement: document.getElementById("undo-button"),
};

//define list item array
export const listItemsButtonsArray = [
  d.offsetListItem,
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
  d.dataTypeListItem,
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

export const commandMap = {
  "get-updates-action-button": "getUpdates",
  "send-message-action-button": "sendMessage",
  "forward-message-action-button": "forwardMessage",
  "forward-all-store-action-button": "forwardAllStore",
  "edit-caption-action-button": "editMessageCaption",
  "caption-all-lookup-action-button": "captionAllLookup",
  "upload-pics-action-button": "sendPhoto",
};

export const titleMap = {
  getUpdates: "Get Updates",
  sendMessage: "Send Message",
  forwardMessage: "Forward Message",
  forwardAllStore: "Forward All Store",
  editMessageCaption: "Edit Message Caption",
  captionAllLookup: "Caption All Lookup",
  sendPhoto: "Send Photo",
};

export const actionButtonMap = {
  "get-updates": [d.offsetListItem],
  "send-message": [d.chatIdListItem, d.textInputListItem],
  "forward-message": [d.messageIdListItem, d.forwardFromListItem, d.forwardToListItem],
  "forward-all-store": [
    d.messageStartListItem,
    d.messageStopListItem,
    d.forwardFromListItem,
    d.forwardToListItem,
    d.forwardAllStoreTypeListItem,
    d.collectionSaveToListItem,
    d.dataTypeListItem,
  ],
  "edit-caption": [d.messageIdListItem, d.editCaptionChannelListItem, d.textInputListItem],
  "caption-all-lookup": [
    d.messageStartListItem,
    d.messageStopListItem,
    d.collectionPullFromListItem,
    d.collectionSaveToListItem,
    d.captionLookupTypeListItem,
    d.editCaptionChannelListItem,
    d.forwardToListItem,
    d.dataTypeListItem,
  ],
  "upload-pics": [
    d.uploadToListItem,
    d.dataTypeListItem,
    d.uploadPicTypeListItem,
    d.picPathListItem,
    d.collectionPullFromListItem,
    d.collectionSaveToListItem,
  ],
};

export const EYE_CLOSED_SVG = `
  <svg id= "eye-closed-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-label="pwToggle">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-label="pwToggle"/>
    <circle cx="12" cy="12" r="3" data-label="pwToggle"/>
    <path d="M2 2l20 20" data-label="pwToggle"/>
  </svg>
`;

export const EYE_OPEN_SVG = `
  <svg id= "eye-open-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-label="pwToggle">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-label="pwToggle"/>
    <circle cx="12" cy="12" r="3" data-label="pwToggle"/>
  </svg>
`;

export default d;
