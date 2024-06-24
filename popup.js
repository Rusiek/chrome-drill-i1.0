document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(
    ["firstName", "lastName", "email", "phoneNumber", "index", "year", "field"],
    function (result) {
      if (
        result.firstName &&
        result.lastName &&
        result.email &&
        result.phoneNumber &&
        result.index &&
        result.year &&
        result.field
      ) {
        document.getElementById("noData").style.display = "none";
        document.getElementById("withData").style.display = "block";
      } else {
        document.getElementById("noData").style.display = "block";
        document.getElementById("withData").style.display = "none";
      }
    }
  );

  document
    .getElementById("dataForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const phoneNumber = document.getElementById("phoneNumber").value;
      const index = document.getElementById("index").value;
      const year = document.getElementById("year").value;
      const field = document.getElementById("field").value;
      chrome.storage.local.set(
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          index: index,
          year: year,
          field: field,
        },
        function () {
          alert("Dane zostały zapisane.");
          document.getElementById("noData").style.display = "none";
          document.getElementById("withData").style.display = "block";
        }
      );
    });

  document.getElementById("changeData").addEventListener("click", function () {
    document.getElementById("noData").style.display = "block";
    document.getElementById("withData").style.display = "none";
  });

  document.getElementById("fillForm").addEventListener("click", function () {
    chrome.storage.local.get(
      [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "index",
        "year",
        "field",
      ],
      function (result) {
        console.log(result);
        if (
          result.firstName &&
          result.lastName &&
          result.email &&
          result.phoneNumber &&
          result.index &&
          result.year &&
          result.field
        ) {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              const activeTab = tabs[0];
              if (activeTab.url.includes("forms.office.com")) {
                chrome.tabs.sendMessage(activeTab.id, {
                  action: "fillForms",
                  firstName: result.firstName,
                  lastName: result.lastName,
                  email: result.email,
                  phoneNumber: result.phoneNumber,
                  index: result.index,
                  year: result.year,
                  field: result.field,
                });
              } else {
                alert("Ta strona nie jest formularzem Microsoft Forms.");
              }
            }
          );
        } else {
          alert("Uzupełnij dane przed wypełnieniem formularza.");
        }
      }
    );
  });
});
