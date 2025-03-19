chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generateAltText",
    title: "Generate alt text",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log(info);
  if (info.menuItemId === "generateAltText" && info.srcUrl) {
    info.srcUrl;
    try {
      const params = await chrome.aiOriginTrial.languageModel.params();
      const session = await chrome.aiOriginTrial.languageModel.create({
        temperature: 0.8,
        topK: params.defaultTopK
      });

      const response = await fetch(info.srcUrl);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);

      chrome.action.setPopup({popup: 'popup.html'});
      const openPopupPromise = chrome.action.openPopup();
      const result = await session.prompt([
        `Please provide a functional, objective description of the provided image in no more than around 30 words so that someone who could not see it would be able to imagine it. If possible, follow an “object-action-context” framework. The object is the main focus. The action describes what’s happening, usually what the object is doing. The context describes the surrounding environment. If there is text found in the image, do your best to transcribe the important bits, even if it extends the word count beyond 30 words. It should not contain quotation marks, as those tend to cause issues when rendered on the web. If there is no text found in the image, then there is no need to mention it. You should not begin the description with any variation of “The image”.`,
        { type: "image", content: imageBitmap}
      ]);
      console.log("result", result);
      await openPopupPromise;
      chrome.runtime.sendMessage({
        action: 'alt-text',
        text: result
      });
    } catch (e) {
      console.log("Prompt API is not available.", e);
    }
  }
});
