export const uploadPicMatch = async (inputParams) => {};

// export const runUploadPics = async (inputParams) => {
//     if (!inputParams || !state.active) return null;
//     const { uploadPicType, uploadToId, collectionPullFrom, collectionSaveTo, collectionExtra } = inputParams;
  
//     if (uploadPicType === "uploadMultiId" || uploadPicType === "uploadMultiSpecial") return await uploadPicMatch(inputParams);
  
//     if (uploadPicType === "uploadSingleURL" || uploadPicType === "uploadListURL") return await uploadPicURL(inputParams);
  
//     const uploadPicArray = await getPicArrayFS(inputParams);
//     console.log("UPLOAD PIC ARRAY");
//     console.log(uploadPicArray);
  
//     if (!uploadPicArray) return null;
  
//     const postPicDataArray = [];
//     for (let i = 0; i < uploadPicArray.length; i++) {
//       if (!state.active) return null;
//       try {
//         const filePath = uploadPicArray[i];
//         const params = {
//           chatId: uploadToId,
//           picPath: filePath,
//         };
  
//         const data = await tgPostPicFS(params);
//         if (!data) continue;
//         console.log(`POSTED PIC ${i + 1} OF ${uploadPicArray.length}`);
//         console.log("POSTED PIC DATA");
//         console.log(data.result);
  
//         if (uploadPicType === "uploadSingleFS" || uploadPicType === "uploadFolderFS") {
//           postPicDataArray.push(data);
//           continue;
//         }
  
//         const picBasePath = path.basename(filePath).trim();
//         const picId = picBasePath.split("_")[0];
  
//         console.log("PIC ID");
//         console.log(picId);
  
//         //KEEP PLAYING WITH IT HERE
  
//         const vidNameParams = {
//           keyToLookup: "picId",
//           itemValue: picId,
//         };
  
//         const vidNameModel = new dbModel(vidNameParams, collectionExtra);
//         const vidNameData = await vidNameModel.getUniqueItem();
//         if (!vidNameData) continue;
  
//         console.log("VID NAME DATA");
//         console.log(vidNameData);
  
//         // const regexParams = {
//         //   keyToLookup: "fileName",
//         //   regexValue: vidNameData.vidSaveName,
//         // };
  
//         const fileDataParams = {
//           keyToLookup: "fileName",
//           itemValue: vidNameData.vidSaveName,
//         };
  
//         const fileDataModel = new dbModel(fileDataParams, collectionPullFrom);
//         const fileData = await fileDataModel.getUniqueItem();
//         if (!fileData) continue;
  
//         console.log("FILE DATA");
//         console.log(fileData);
  
//         const forwardParams = {
//           forwardToId: uploadToId,
//           forwardFromId: fileData.forwardFromChannelId,
//           messageId: fileData.forwardFromMessageId,
//         };
  
//         const forwardData = await tgForwardMessage(forwardParams);
//         if (!forwardData) continue;
//         console.log("FORWARD DATA");
//         console.log(forwardData);
  
//         const storeModel = new dbModel(forwardData, collectionSaveTo);
//         const storeData = await storeModel.storeAny();
//         console.log("STORE DATA");
//         console.log(storeData);
  
//         postPicDataArray.push(forwardData);
//       } catch (e) {
//         console.log(e.message + "\n" + e.data + "\n" + e.status);
//       }
//     }
  
//     return postPicDataArray;
//   };
  
