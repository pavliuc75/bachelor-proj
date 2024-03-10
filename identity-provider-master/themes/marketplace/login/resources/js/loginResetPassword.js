function runLoginResetPasswordScripts() {
    handleEmailStyling();
}

function handleEmailStyling() {
    let email = document.getElementById("email");
    let emailErrorText = document.getElementById("email-error-text");
    if (email && emailErrorText) {
        if (emailErrorText.innerText.trim().length) {
            emailErrorText.style.display = "block";
            email.classList.remove("border-mid-gray", "focus-visible-border-dark-blue");
            email.classList.add("border-error", "focus-visible-border-error");
        } else {
            emailErrorText.style.display = "none";
            email.classList.remove("border-error", "focus-visible-border-error");
            email.classList.add("border-mid-gray", "focus-visible-border-dark-blue");
        }
    }
}

function clearEmailErrorText() {
    let emailErrorText = document.getElementById("email-error-text");
    if (emailErrorText) {
        emailErrorText.innerText = '';
        handleEmailStyling();
    }
}