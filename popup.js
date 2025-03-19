const altTextInput = document.getElementById("altText");
const loading = document.getElementById("loading");
const lang = document.getElementById("lang");
let text = "";

lang.addEventListener("change", async function () {
  altTextInput.setAttribute("hidden", true);
  loading.removeAttribute("hidden");
  text = await translate(text);
  showAltText();
});

async function translate(string) {
  const translator = await self.ai.translator.create({
    sourceLanguage: "en",
    targetLanguage: lang.value,
  });
  return translator.translate(string);
}

async function showAltText() {
  altTextInput.value = text;
  loading.setAttribute("hidden", true);
  altTextInput.removeAttribute("hidden");
}

chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    if (request.action === "alt-text") {
      text = request.text;
      if (lang.value != "en") {
        text = await translate(text);
      }
      showAltText();
    }
  }
);

document.getElementById("copyClose").addEventListener("click", () => {
  const altText = altTextInput.value;
  navigator.clipboard.writeText(altText).then(() => {
    window.close();
  });
});

document.getElementById("discard").addEventListener("click", () => {
  window.close();
});
