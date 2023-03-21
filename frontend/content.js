chrome.storage.local.set({ originWindow: window.location.origin });

$(document).ready(function () {
  // localStorage.removeItem("access_token");
  // localStorage.removeItem("expiry_time");

  const CLIENT_ID =
    "460275944891-r69qqtccnrjoobv9selsdetr320gqu86.apps.googleusercontent.com";
  const SCOPES =
    "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/gmail.modify";

  const authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=token&scope=${encodeURIComponent(
    SCOPES
  )}&redirect_uri=${encodeURIComponent(window.location.origin)}`;

  let accessToken = localStorage.getItem("access_token");
  let expiryTime = localStorage.getItem("expiry_time");

  var hashParams = new URLSearchParams(window.location.hash.substr(1));
  var ACCESS_TOKEN = hashParams.get("access_token");
  console.log("hello first", ACCESS_TOKEN);
  var EXPIRY_TIME = hashParams.get("expires_in");
  if (ACCESS_TOKEN && EXPIRY_TIME) {
    accessToken = ACCESS_TOKEN;
    expiryTime = new Date().getTime() + EXPIRY_TIME * 1000;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("expiry_time", expiryTime);
  } else if (accessToken && expiryTime && new Date().getTime() < expiryTime) {
    ACCESS_TOKEN = accessToken;
  }
  //  else {
  //   console.log("else");
  //   window.location.href = authorizeUrl;
  // }

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
        Object.assign(alertpopupParent.style, {
          position: "relative",
        });
      }, 5000);
    } else {
      var htmlfile = `
<html>
<div id="myModal" class="modal">

<!-- Modal content -->
<div class="modal-content">
<div style="border-radius: 5px;
background-color: transparent;
padding: 20px;">
   
<div class="popup-container v-flex">
<h4>Choose action for selected emails</h4>

<div class="email-list-container section">
  <span>${
    selectedRowEmail.length < 3
      ? selectedRowEmail.join(",  ")
      : selectedRowEmail[0] +
        ",  " +
        selectedRowEmail[1] +
        "+  " +
        (selectedRowEmail.length - 2).toString() +
        " emails"
  }</span>
</div>

<div class="option-section v-flex">
  <div class="option section archive" >
    <input
      type="radio"
      name="filter"
      value="archive"
      id="archive"
      
    />
    <label for="archive">Archive (Mark as read and skip inbox)</label>
  </div>
  <div class="option section mark_read" >
    <input
      type="radio"
      name="filter"
      value="mark_read"
      id="read"
      
    />
    <label for="read">Mark as read</label>
  </div>
  <div class="option section delete_filter" >
    <input
      type="radio"
      name="filter"
      value="delete_filter"
      id="delete"
      
    />
    <label for="delete">Delete permanently</label>
  </div>
</div>

<div class="checkbox-section option1" >
  <input
    type="checkbox"
    name="domain"
    id="domain"
    class="domain-checkbox"
  />
  <label for="domain">Apply action for email domains</label>
</div>

<div class="action-section">
  <button class="success-btn">Apply filter</button>
  <button class="cancel-btn">Cancel</button>
</div>
</div>

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
      // var submit_btn = document.getElementsByClassName("my-submit-btn")[0];

      // for radio buttons
      var domain = false;
      $(".option.section,.checkbox-section").click(function (e) {
        e.target.children[0]?.click();
      });
      $(".domain").click(function (e) {
        domain = true;
      });
      $(".success-btn").click(function () {
        console.log("domain", domain);
        let filterValue = $("input[name='filter']:checked").val();
        console.log("archive clicked", filterValue);
        filterVar = "archive";

        var msg = "Messages from emails are deleted permenently!";
        let msgColor = "green";
        if (!accessToken) {
          console.log("hello in if of !accessToken");
          msg = "First, agree to the terms and conditions.";
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
          Object.assign(alertpopupParent.style, {
            position: "relative",
          });
          alertPopup.style.removeProperty("background");
          alertPopup.innerHTML = "";
        }, 5000);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedEmails: selectedRowEmail,
            ACCESS_TOKEN,
            domain,
          }),
        };
        fetch(
          `http://localhost:8000/api/filter?action=${filterValue}`,
          requestOptions
        )
          .then((response) => console.log(response.json()))
          .catch((e) => console.log(e));
      });

      var closebtn = document.getElementsByClassName("close")[0];
      $(".cancel-btn").click(function () {
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
    const toolbarSection = [...document.getElementsByClassName("G-tF")].map(
      (ele) => {
        ele.appendChild(wrapper);
      }
    );
    // toolbarSection.appendChild(wrapper);

    selfMail = document
      .getElementsByClassName("gb_e gb_1a gb_s")[0]
      .getAttribute("aria-label")
      .split("(")
      .pop()
      .split(")")
      .shift();
    console.log(selfMail);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ACCESS_TOKEN,
      }),
    };
    fetch(`http://localhost:8000/getMail`, requestOptions)
      .then((response) =>
        response
          .json()
          .then((res) => (res.email == selfMail ? "" : localStorage.clear()))
      )
      .catch((e) => console.log(e));

    setTimeout(addListenerToList, 0);
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
    // console.log("emails listener check annd add", intervalWatcher);
    // console.log(selfMail);
    if (!window.location.href.endsWith("inbox")) {
      clearInterval(intervalWatcher);
      // console.log("stopped", intervalWatcher);
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