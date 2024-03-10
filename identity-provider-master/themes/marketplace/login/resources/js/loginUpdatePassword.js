function runLoginUpdatePasswordScripts() {
    let updatePasswordFrom = document.getElementById("update-password-form");
    if (updatePasswordFrom) {
        updatePasswordFrom.addEventListener('submit', handleUpdatePasswordFormSubmit)
    }
}

function handleUpdatePasswordFormSubmit(event) {
    event.preventDefault();
    validateUpdatePasswordForm();
    if (validateContainsFiveCharacters() && validateContainsANumber() && validatePasswordAreEqual()) {
        document.getElementById("update-password-form").submit();
    }
}

function validatePasswordInput() {
    let updatePassword = document.getElementById("update-password");
    let updatePasswordErrorText1 = document.getElementById('update-password-error-text-1');
    let updatePasswordErrorText2 = document.getElementById('update-password-error-text-2');
    if (updatePassword) {
        let result1 = validateContainsFiveCharacters();
        let result2 = validateContainsANumber();
        if (!result1) {
            updatePasswordErrorText1.style.display = "block";
            updatePasswordErrorText2.style.display = "none";
            updatePassword.classList.remove("border-mid-gray", "focus-visible-border-dark-blue");
            updatePassword.classList.add("border-error", "focus-visible-border-error");
        } else if (!result2) {
            updatePasswordErrorText1.style.display = "none";
            updatePasswordErrorText2.style.display = "block";
            updatePassword.classList.remove("border-mid-gray", "focus-visible-border-dark-blue");
            updatePassword.classList.add("border-error", "focus-visible-border-error");
        } else {
            updatePasswordErrorText1.style.display = "none";
            updatePasswordErrorText2.style.display = "none";
            updatePassword.classList.remove("border-error", "focus-visible-border-error");
            updatePassword.classList.add("border-mid-gray", "focus-visible-border-dark-blue");
        }
    }
}

function validatePasswordRepeatInput() {
    let updatePasswordRepeat = document.getElementById("update-password-repeat");
    let updatePasswordRepeatErrorText = document.getElementById('update-password-repeat-error-text');
    if (updatePasswordRepeat) {
        let result = validatePasswordAreEqual();
        if (result) {
            updatePasswordRepeatErrorText.style.display = "none";
            updatePasswordRepeat.classList.remove("border-error", "focus-visible-border-error");
            updatePasswordRepeat.classList.add("border-mid-gray", "focus-visible-border-dark-blue");
        } else {
            updatePasswordRepeatErrorText.style.display = "block";
            updatePasswordRepeat.classList.remove("border-mid-gray", "focus-visible-border-dark-blue");
            updatePasswordRepeat.classList.add("border-error", "focus-visible-border-error");
        }
    }
}

function validateContainsFiveCharacters() {
    let updatePassword = document.getElementById("update-password")?.value;
    let trimmedString = (updatePassword || "").trim();
    return trimmedString.length >= 5;
}

function validateContainsANumber() {
    let updatePassword = document.getElementById("update-password")?.value;
    let trimmedString = (updatePassword || "").trim();
    return /\d/.test(trimmedString);
}

function validatePasswordAreEqual() {
    let updatePassword = document.getElementById("update-password");
    let updatePasswordRepeat = document.getElementById("update-password-repeat");
    if (updatePassword) {
        let value1 = updatePassword.value;
        let value2 = updatePasswordRepeat.value;
        if (value1 != null && value2 != null) {
            return value1 === value2;
        }
    }
    return false;
}

function validateUpdatePasswordForm() {
    validatePasswordInput();
    validatePasswordRepeatInput();
}