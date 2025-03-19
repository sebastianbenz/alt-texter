const altTextInput = document.getElementById("altText");
const loading = document.getElementById("loading");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "alt-text") {
    altTextInput.value = request.text;
    loading.setAttribute('hidden', true);
    altTextInput.removeAttribute('hidden');
  }
});

document.getElementById("copyClose").addEventListener("click", () => {
  const altText = altTextInput.value;
  navigator.clipboard.writeText(altText).then(() => {
    window.close();
  });
});

document.getElementById("discard").addEventListener("click", () => {
  window.close();
});
