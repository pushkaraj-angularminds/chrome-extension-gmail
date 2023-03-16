let btn = document.getElementById("extension-btn");
let originPath = "";

chrome.storage.local.get((res) => {
  originPath = res.originWindow;
  console.log(originPath);
});

btn.addEventListener("click", async () => {
  console.log("button click");

  const CLIENT_ID =
    "460275944891-r69qqtccnrjoobv9selsdetr320gqu86.apps.googleusercontent.com";
  //   let email = "akiidadabcs@gmail.com";
  const SCOPES =
    "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/gmail.modify";

  const authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=token&scope=${encodeURIComponent(
    SCOPES
  )}&redirect_uri=${encodeURIComponent(originPath)}`;

  chrome.tabs.update({ url: authorizeUrl });
});
