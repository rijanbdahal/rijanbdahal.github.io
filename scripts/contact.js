"use strict";

var core = core || {};

(function(core) {
    class Contact {
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        set fullName(value) {
            this._fullName = value;
        }

        get fullName() {
            return this._fullName;
        }

        set contactNumber(value) {
            this._contactNumber = value;
        }

        get contactNumber() {
            return this._contactNumber;
        }

        get emailAddress() {
            return this._emailAddress;
        }

        set emailAddress(value) {
            this._emailAddress = value;
        }

        toString() {
            return `FullName: ${this._fullName}\n 
                Contact Number ${this._contactNumber}\n 
                Email Address ${this._emailAddress} \n`;
        }

        /**
         Serialize for writing to localStorage
         */
        serialize() {
            if (this._fullName !== "" && this._contactNumber !== "" && this._emailAddress !== "") {
                return `${this.fullName},${this.contactNumber},${this.emailAddress}`;
            }

            console.error("One or more of the Contact Attributes are empty or invalid!");
            return null;
        }

        /**
         * Deserialize is used to read data from the localStorage
         * */
        deserialize(data) {
            let propertyArray = data.split(",");
            this._fullName = propertyArray[0];
            this._contactNumber = propertyArray[1];
            this._emailAddress = propertyArray[2];
        }
    }

    // Export the Contact class to the core namespace
    core.Contact = Contact;
})(core);

