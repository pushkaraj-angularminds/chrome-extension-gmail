chrome.storage.local.set({ originWindow: window.location.origin });

$(document).ready(function () {
  // const CLIENT_ID =
  //   "460275944891-r69qqtccnrjoobv9selsdetr320gqu86.apps.googleusercontent.com";
  // let email = "akiidadabcs@gmail.com";
  // const SCOPES =
  //   "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/gmail.modify";

  // const authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=token&scope=${encodeURIComponent(
  //   SCOPES
  // )}&redirect_uri=${encodeURIComponent(window.location.origin)}`;

  // let accessToken = localStorage.getItem("access_token");

  // const hashParams = new URLSearchParams(window.location.hash.substr(1));
  // var ACCESS_TOKEN = hashParams.get("access_token");
  // if (ACCESS_TOKEN) {
  //   accessToken = ACCESS_TOKEN;
  //   localStorage.setItem("access_token", accessToken);
  // } else if (accessToken) {
  //   ACCESS_TOKEN = accessToken;
  // } else {
  //   accessToken = ACCESS_TOKEN;
  //   window.location.href = authorizeUrl;
  // }
  const CLIENT_ID =
    "460275944891-r69qqtccnrjoobv9selsdetr320gqu86.apps.googleusercontent.com";
  let email = "akiidadabcs@gmail.com";
  const SCOPES =
    "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/gmail.modify";

  const authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=token&scope=${encodeURIComponent(
    SCOPES
  )}&redirect_uri=${encodeURIComponent(window.location.origin)}`;

  let accessToken = localStorage.getItem("access_token");
  let expiryTime = localStorage.getItem("expiry_time");

  const hashParams = new URLSearchParams(window.location.hash.substr(1));
  var ACCESS_TOKEN = hashParams.get("access_token");
  var EXPIRY_TIME = hashParams.get("expires_in");
  if (ACCESS_TOKEN && EXPIRY_TIME) {
    accessToken = ACCESS_TOKEN;
    expiryTime = new Date().getTime() + EXPIRY_TIME * 1000;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("expiry_time", expiryTime);
  } else if (accessToken && expiryTime && new Date().getTime() < expiryTime) {
    ACCESS_TOKEN = accessToken;
  } else {
    window.location.href = authorizeUrl;
  }

  // Check token expiration every 10 minutes
  setInterval(() => {
    if (expiryTime && new Date().getTime() >= expiryTime) {
      window.location.href = authorizeUrl;
    }
  }, 10 * 60 * 1000);

  let intervalWatcher;
  let selfMail;
  let selectedRowEmail = [];
  const wrapper = document.createElement("div");
  wrapper.className = "G-Ni G-aE J-J5-Ji";
  wrapper.style.display = "none";
  wrapper.style.position = "relative";

  const container = document.createElement("div");
  container.className = "T-I J-J5-Ji nX T-I-ax7 T-I-Js-Gs mA";
  container.setAttribute("role", "button");
  container.setAttribute("tabindex", "0");
  container.setAttribute("data-tooltip", "Get sender emails");
  container.setAttribute("aria-label", "Get sender emails");
  container.style.userSelect = "none";
  container.addEventListener("mouseover", () => {
    container.classList.add("T-I-JW");
  });
  container.addEventListener("mouseleave", () => {
    container.classList.remove("T-I-JW");
  });
  container.addEventListener("click", () => {
    if (selectedRowEmail.length > 470) {
      var alertPopup = document.getElementsByClassName("vh")[0];
      alertPopup.style.background = "red";
      alertPopup.innerHTML = `<span class="aT"><span class="bAq">Cannot select more than 470 email addresses!</span><span class="bAo">&nbsp;<span class="ag a8k" tabindex="0" role="alert" id="link_undo" param="#thread-a:r-4302120075518949594" idlink="" style="visibility:hidden" aria-live="assertive">Undo</span></span></span><div tabindex="0" role="button" class="bBe"><div class="bBf"></div></div>`;
      const alertpopupParent = document.getElementsByClassName("b8 UC")[0];
      alertpopupParent.classList.add("bAp");
      Object.assign(alertpopupParent.style, { position: "unset" });
      setTimeout(() => {
        alertpopupParent.classList.remove("bAp");
        Object.assign(alertpopupParent.style, { position: "relative" });
      }, 5000);
    } else {
      // stores emails after map

      // let liHtml = "";

      // selectedRowEmail.map((mails) => {
      //   liHtml += `<li>${mails}</li>`;
      // });
      //       var htmlfile = `
      //     <html>
      //     <div id="myModal" class="modal">

      //   <!-- Modal content -->
      //   <div class="modal-content">
      //     <span class="close">&times;</span>
      //     <div style="border-radius: 5px;
      //     background-color: #f2f2f2;
      //     padding: 20px;">
      //        <form>
      //      <p style="color:red"> Are you sure you want to permenently Delete Emails from below addresses?</p>
      //     <ul>${liHtml}</ul>
      //    <input style=" width: 100%;
      // background-color: #4CAF50;
      // color: white;
      // padding:0px 20px;
      // margin: 8px 0;
      // border: none;
      // border-radius: 4px;
      // cursor: pointer;" type="button" value="Submit" class="btn btn-primary my-submit-btn""></input>
      //   </form>
      //     </div>
      //   </div>

      // </div>
      //     `;

      var htmlfile = `
<html>
<div id="myModal" class="modal">

<!-- Modal content -->
<div class="modal-content">
<span class="close">&times;</span>
<div style="border-radius: 5px;
background-color: #f2f2f2;
padding: 20px;">
   <form >
   <div>
   <p>Please select which filter you want to apply.</p>
  <input type="radio" id="skip_inbox" class="skip_inbox" name="filters" value="skip inbox">
  <label for="html">Skip inbox</label><br>
  <input type="radio" id="delete_filter" class="delete_filter" name="filters" value="Delete">
  <label for="css">Delete it</label><br>
  <input type="radio" id="mark_read" class="mark_read" name="filters" value="mark as read">
  <label for="javascript">Mark as Read</label><br><br>
<input type="checkbox" id="domain" name="domain" value="domainValue">
<label>Apply this filter to Domain wide</label><br><br>
   </div>
<input style=" width: 100%;
background-color: #4CAF50;
color: white;
padding:0px 20px;
margin: 8px 0;
border: none;
border-radius: 4px;
cursor: pointer;" type="button" value="Submit" class="btn btn-primary my-submit-btn""></input>
</form>
</div>
</div>

</div>
`;

      var popupElement = document.createElement("div");
      popupElement.className = "J-M aX0 aYO newPopup";
      popupElement.setAttribute("tabindex", "0");

      popupElement.role = "menu";
      popupElement.ariaHasPopup = "true";
      const popupElementStyle = {
        "user-select": "none",
        top: "20px",
        left: "30px",
        position: "absolute",
      };
      Object.assign(popupElement.style, popupElementStyle);
      const headerDiv = document.createElement("div");
      const popup = document.createElement("div");
      popup.innerHTML += htmlfile;
      popup.className = "SK AX";
      const popupStyle = {
        "user-select": "none",
        "min-width": "12px",
      };
      Object.assign(popup.style, popupStyle);
      headerDiv.appendChild(popup);
      popupElement.appendChild(headerDiv);
      document.body.appendChild(popupElement);
      var modal = document.getElementById("myModal");
      var submit_btn = document.getElementsByClassName("my-submit-btn")[0];

      // for radio buttons
      var postApi = "";
      $(".skip_inbox").click(function () {
        postApi = "skip_inbox";
      });
      $(".delete_filter").click(function () {
        postApi = "delete_filter";
      });
      $(".mark_read").click(function () {
        postApi = "mark_read";
      });

      $(".my-submit-btn").click(function () {
        // $(this).hide();
        var msg = "Messages from emails are deleted permenently!";
        let msgColor = "green";
        if (!accessToken || !ACCESS_TOKEN) {
          msg =
            "You are not allow to use this extension before accepting terms and Conditions !! ";
          msgColor = "red";
        }
        setTimeout(() => {
          popupElement.style.display = "none";
          modal.style.display = "none";
        }, 2000);
        var alertPopup = document.getElementsByClassName("vh")[0];
        alertPopup.style.background = msgColor;
        alertPopup.innerHTML = `<span class="aT"><span class="bAq" style="margin:10px 0px">${msg}</span><span class="bAo">&nbsp;<span class="ag a8k" tabindex="0" role="alert" id="link_undo" param="#thread-a:r-4302120075518949594" idlink="" style="visibility:hidden" aria-live="assertive">Undo</span></span></span><div tabindex="0" role="button" class="bBe"><div class="bBf"></div></div>`;
        const alertpopupParent = document.getElementsByClassName("b8 UC")[0];
        alertpopupParent.classList.add("bAp");
        Object.assign(alertpopupParent.style, {
          position: "unset",
        });
        setTimeout(() => {
          alertpopupParent.classList.remove("bAp");
          Object.assign(alertpopupParent.style, { position: "relative" });
        }, 5000);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedEmails: selectedRowEmail,
            ACCESS_TOKEN,
          }),
        };
        fetch("http://localhost:8000/", requestOptions)
          .then((response) => console.log(response.json()))
          .catch((e) => console.log(e));
      });

      var closebtn = document.getElementsByClassName("close")[0];
      $(".close").click(function () {
        popupElement.style.display = "none";
        modal.style.display = "none";
      });
    }
  });

  const iconContainer = document.createElement("div");
  iconContainer.className = "asa";

  const iconSection = document.createElement("img");
  iconSection.className = "T-I-J3 J-J5-Ji ";
  iconSection.src = chrome.runtime.getURL("assets/filter-btn.svg");

  iconContainer.appendChild(iconSection);
  container.appendChild(iconContainer);
  wrapper.appendChild(container);

  const popupContainer = document.createElement("div");
  popupContainer.className = "J-M aX0 aYO";
  popupContainer.role = "menu";
  popupContainer.ariaHasPopup = "true";
  const popupContainerStyle = {
    "user-select": "none",
    top: "20px",
    left: "30px",
    position: "absolute",
    display: "none",
  };
  Object.assign(popupContainer.style, popupContainerStyle);

  const popup = document.createElement("div");
  popup.className = "SK AX";
  const popupStyle = {
    "user-select": "none",
    "min-width": "12px",
  };
  Object.assign(popup.style, popupStyle);

  function actions() {
    const toolbarSection = document.getElementsByClassName("G-tF")[0];
    toolbarSection.appendChild(wrapper);

    selfMail = document
      .getElementsByClassName("gb_e gb_1a gb_s")[0]
      .getAttribute("aria-label")
      .split("(")
      .pop()
      .split(")")
      .shift();

    addListenerToList();
    intervalWatcher = setInterval(addListenerToList, 1000);
  }

  function executeAction() {
    try {
      actions();
    } catch (error) {
      console.log("DOM not ready");
      console.log(error);
      setTimeout(executeAction, 1000);
    }
  }

  setTimeout(executeAction, 1000);

  function addListenerToList() {
    // console.log("emails listener check annd add");
    if (!window.location.href.endsWith("inbox")) {
      clearInterval(intervalWatcher);
      console.log("stopped", intervalWatcher);
      setTimeout(executeAction, 1000);
    }

    let emailList = document.getElementsByTagName("tbody");
    emailList = emailList[emailList.length - 1];

    const checkbox = [...emailList.querySelectorAll(".oZ-jc.T-Jo.J-J5-Ji")];

    checkbox.forEach((element) => {
      if (!element.getAttribute("listener")) {
        element.setAttribute("listener", "true");
        // oZ-jc T-Jo J-J5-Ji
        element.addEventListener("click", (event) => {
          setTimeout(() => {
            getSelectedEmailList(emailList);
          }, 0);
        });
      }
    });
  }

  function getSelectedEmailList(emailListRef) {
    selectedRowEmail = [];
    const selectedEmailRowList = [...emailListRef.getElementsByClassName("x7")];
    selectedEmailRowList.map((emailRow) => {
      [...emailRow.querySelectorAll("[email]")].map((ele) => {
        let mail = ele.getAttribute("email");
        if (mail !== selfMail) {
          selectedRowEmail.push(mail);
        }
      });
    });

    selectedRowEmail = [...new Set(selectedRowEmail)];

    console.log(selectedRowEmail);

    popup.innerHTML = "";
    popupContainer.innerHTML = "";

    popupContainer.appendChild(popup);
    wrapper.appendChild(popupContainer);
  }
});
