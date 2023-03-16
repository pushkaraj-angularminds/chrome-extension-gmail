chrome.runtime.onInstalled.addListener(() => {
  console.log("hellw from background js");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_DATA") {
    const data = message.data;
    console.log(data);
  }
});
