const d = {
  //define return display and make pretty elements
  sectionReturnWrapper: document.getElementById("data-return-section"),
  dataReturnUpdatesElement: document.getElementById("data-return-element"),
  makePrettyUpdatesElement: document.getElementById("make-pretty-button"),
  undoButtonElement: document.getElementById("undo-button"),
};

//define list item array
export const listItemsButtonsArray = [
  "list-item-offset",
  "list-item-message-id",
  "list-item-chat-id",
  "list-item-message-start",
  "list-item-message-stop",
  "list-item-forward-from-chat-id",
  "list-item-forward-to-chat-id",
  "list-item-upload-to",
  "list-item-edit-captions-channel",
  "list-item-collection-pull-from",
  "list-item-collection-pic",
  "list-item-collection-save-to",
  "list-item-forward-all-store-type",
  "list-item-caption-lookup-type",
  "list-item-upload-pic-type",
  "list-item-text-input",
  "list-item-command",
  "list-item-pic-path",
  "list-item-data-type",
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
  "get-updates": ["list-item-offset"],
  "send-message": ["list-item-chat-id", "list-item-text-input"],
  "forward-message": ["list-item-message-id", "list-item-forward-from-chat-id", "list-item-forward-to-chat-id"],
  "forward-all-store": [
    "list-item-message-start",
    "list-item-message-stop",
    "list-item-forward-from-chat-id",
    "list-item-forward-to-chat-id",
    "list-item-forward-all-store-type",
    "list-item-collection-save-to",
    "list-item-data-type",
  ],
  "edit-caption": ["list-item-message-id", "list-item-edit-captions-channel", "list-item-text-input"],
  "caption-all-lookup": [
    "list-item-message-start",
    "list-item-message-stop",
    "list-item-collection-pull-from",
    "list-item-collection-save-to",
    "list-item-caption-lookup-type",
    "list-item-edit-captions-channel",
    "list-item-forward-to-chat-id",
    "list-item-data-type",
  ],
  "upload-pics": [
    "list-item-upload-to",
    "list-item-data-type",
    "list-item-upload-pic-type",
    "list-item-pic-path",
    "list-item-collection-pull-from",
    "list-item-collection-pic",
    "list-item-collection-save-to",
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
