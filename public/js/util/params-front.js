import d from "./define-things.js";

// export const setCommandType = async (clickElement) => {
//   if (!clickElement) return null;
//   console.log("!!!SET COMMAND TYPE");
//   console.log(clickElement);
//   console.log(clickElement.id);

//   // d.commandType.value = clickElement.id;
//   // return true;
// };

export const getAuthParams = async () => {
  const authPwInput = document.getElementById("auth-pw-input");

  try {
    const params = {
      //REMOVE PLACEHOLDER BELOW
      pw: authPwInput.value || authPwInput.placeholder,
    };

    return params;
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

//BUILD INPUT PARAMS
export const buildInputParams = async () => {
  //reset each time
  const params = {
    route: "/tg-submit-route",
    offset: document.getElementById("offset-input").value,
    chatId: document.getElementById("chat-id-input").value,
    messageId: document.getElementById("message-id-input").value,
    dataType: document.getElementById("data-type-input").value,
    command: document.getElementById("command-input").value,
    text: document.getElementById("text-input").value,
    messageStart: +document.getElementById("message-start-input").value,
    messageStop: +document.getElementById("message-stop-input").value,
    editChannelId: document.getElementById("edit-captions-channel").value,
    forwardFromId: document.getElementById("from-chat-id-input").value,
    forwardToId: document.getElementById("to-chat-id-input").value,
    uploadToId: document.getElementById("upload-to-input").value,
    forwardAllType: document.getElementById("forward-all-store-type-input").value,
    captionAllType: document.getElementById("lookup-type-caption-input").value,
    uploadPicType: document.getElementById("lookup-type-upload-pic-input").value,
    picPath: document.getElementById("pic-path-input").value,
    collectionPullFrom: document.getElementById("collection-pull-from-input").value,
    collectionPic: document.getElementById("collection-pic-input").value,
    collectionSaveTo: document.getElementById("collection-save-to-input").value,
  };

  return params;
};
