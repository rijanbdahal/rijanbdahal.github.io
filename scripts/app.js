"use strict";

function CheckLogin() {
    if (sessionStorage.getItem("user")) {
        $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`);
    }
    $("#logout").on("click", function () {
        sessionStorage.clear();
        location.href = "login.html";
    });
}

function LoadHeader(html_data) {
    $("header").html(html_data);
    $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
    CheckLogin();
}

function AjaxRequest(method, url, callback) {
    //step1 : Instantiate an XHR object
    let xhr = new XMLHttpRequest();

    //Step 2: open a connection to the server
    xhr.open(method, url);

    //Step3: Add event listener for readystatechange event
    // the readystate event is being triggered when the
    //state of the document being fetched changes.
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //response succeeded - data is available in here only
            if (typeof callback == "function") {
                callback(xhr.responseText);
            } else {
                console.error("ERROR: callback not a function");
            }
        }
    });

    //step4: send the request
    xhr.send();
}

document.addEventListener("DOMContentLoaded", function () {
    const AddContact = (fullName, contactNumber, emailAddress) => {
        let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);
        if (contact.serialize()) {
            let key = contact.fullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    };

    function DisplayHomePage() {
        console.log("Called DisplayHomePage()");

        $("#AboutUsBtn").on("click", () => {
            location.href = "about.html";
        });

        $("main").append(`<p id="MainParagraph" class="mt-3">This is my first Paragraph</p>`);

        $("body").append('<article class="container"><p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>');
    }

    function DisplayProductPage() {
        console.log("Called DisplayProductPage()");
    }

    function DisplayAboutUsPage() {
        console.log("Called DisplayAboutUsPage()");
    }

    function DisplayContactPage() {
        console.log("Called DisplayContactPage()");
    }

    function DisplayServicePage() {
        console.log("Called DisplayServicePage()");
    }

    function DisplayContactUsPage() {
        console.log("Called DisplayContactUsPage()");

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function () {
            if (subscribeCheckbox.checked) {
                AddContact(fullName.value, contactNumber.value, emailAddress.value);
            }
        });
    }

    function DisplayContactListPage() {
        console.log("Called DisplayContactListPage()");

        if (localStorage.length > 0) {
            let contactList = $("#contactList");
            let data = "";

            let keys = Object.keys(localStorage);
            let index = 1;

            for (const key of keys) {
                let contactData = localStorage.getItem(key);
                let contact = new core.Contact();
                contact.deserialize(contactData);

                data += `<tr><th scope="row" class="text-center">${index}</th>
                     <td>${contact.fullName}</td>
                     <td>${contact.contactNumber}</td>
                     <td>${contact.emailAddress}</td>
                     <td class="text-center">
                         <button value="${key}" class="btn btn-primary btn-sm edit">
                             <i class="fas fa-edit fa-sm"> Edit </i>
                         </button>
                     </td>
                     <td>
                         <button value="${key}" class="btn btn-primary btn-sm delete">
                             <i class="fas fa-trash fa-sm"> Delete </i>
                         </button>
                     </td>
                     </tr>`;

                index++;
            }
            contactList.innerHTML =data;
        }

        $("#addButton").on("click", () => {
            location.href = "edit.html#add";
        });

        $("button.edit").on("click", function () {
            location.href = "edit.html#" + $(this).val();
        });

        $("button.delete").on("click", function () { // Correct event binding
            if (confirm("Delete Contact, Please confirm")) {
                localStorage.removeItem($(this).val());
            }
            location.href = "contact-list.html";
        });
    }

    function DisplayEditPage() {
        console.log("DisplayEdit page Called...");

        let page = location.hash.substring(1);
        let mainH1 = $("main>h1");
        let editButton = $("#editButton");
        let fullNameInput = $("#fullName");
        let contactNumberInput = $("#contactNumber");
        let emailAddressInput = $("#emailAddress");
        let cancelButton = $("#cancelButton");

        switch (page) {
            case "add":
                // Add contact chosen
                mainH1.text("Add Contact");
                editButton.html(`<i class="fas fa-plus-circle fa-sm"> Add </i>`);
                editButton.on("click", (event) => {
                    // Prevent form submission
                    event.preventDefault();
                    AddContact(fullNameInput.val(), contactNumberInput.val(), emailAddressInput.val());
                    location.href = "contact-list.html";
                });

                cancelButton.on("click", (event) => {
                    location.href = "contact-list.html";
                });

                break;
            default:
                // Edit contact chosen
                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page));

                // Pre-populate form
                fullNameInput.val(contact.fullName);
                contactNumberInput.val(contact.contactNumber);
                emailAddressInput.val(contact.emailAddress);

                editButton.on("click", (event) => {
                    event.preventDefault();
                    contact.fullName = fullNameInput.val();
                    contact.emailAddress = emailAddressInput.val();
                    contact.contactNumber = contactNumberInput.val();

                    localStorage.setItem(page, contact.serialize());
                    location.href = "contact-list.html";
                });

                cancelButton.on("click", (event) => {
                    location.href = "contact-list.html";
                });

                break;
        }
    }


    function DisplayLoginPage() {
        console.log("Called displaylogin page");

        let messageArea = $("#messageArea");
        messageArea.hide();
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();

            let username = $("#userName").val();
            let password = $("#password").val();


            $.get("./data/users.json", function (data) {

                for (const user of data.users) {
                    console.log(user);
                    if (username === user.UserName && password === user.Password) { // Corrected property access
                        success = true;
                        newUser.fromJSON(user);
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    location.href = "contact-list.html";
                } else {
                    $('#userName').trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger")
                        .text("Error: Invalid Login Credentials")
                        .show();
                }
            });
        });

        $("#cancelButton").on("click", function () {
            // Reset the form fields
            $("#userName").val("");
            $("#password").val("");
            location.href = "index.html";
        });
    }


    function DisplayRegisterPage() {
        console.log("Called display register page")
    }

    function ContactFormValidation() {
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter a valid First Name and ");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid contact number");
        // ValidateField("",); // You seem to be missing the regular expression and error message here.
    }

    /**
     * This function validates input form text field.
     * @param input_field_id
     * @param regular_expression
     * @param error_message
     *
     */
    function ValidateField(input_field_id, regular_expression, error_message) {
        let messageArea = $("#messageArea").hide();

        $(input_field_id).on("blur", function () {
            //fail validation
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger");
                messageArea.text(error_message);
                messageArea.show();
            }
            //pass validation
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }

    function Start() {
        console.log("App Started");

        AjaxRequest("GET", "header.html", LoadHeader);

        switch (document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Our Products":
                DisplayProductPage();
                break;
            case "About Us":
                DisplayAboutUsPage();
                break;
            case "Our Services":
                DisplayServicePage();
                break;
            case "Contact Us":
                DisplayContactUsPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
        }
    }

    window.addEventListener("load", Start);
});
