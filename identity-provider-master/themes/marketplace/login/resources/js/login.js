function runLoginScripts() {
    handlePasswordStyling();
    setHyperlinksToOtherProviders();
}

function handlePasswordStyling() {
    let password = document.getElementById("password");
    let passwordErrorText = document.getElementById("password-error-text");
    if (password && passwordErrorText) {
        if (passwordErrorText.innerText.trim().length) {
            passwordErrorText.style.display = "block";
            password.classList.remove("border-mid-gray", "focus-visible-border-dark-blue");
            password.classList.add("border-error", "focus-visible-border-error");
        } else {
            passwordErrorText.style.display = "none";
            password.classList.remove("border-error", "focus-visible-border-error");
            password.classList.add("border-mid-gray", "focus-visible-border-dark-blue");
        }
    }
}

function clearPasswordErrorText() {
    let passwordErrorText = document.getElementById("password-error-text");
    if (passwordErrorText) {
        passwordErrorText.innerText = '';
        handlePasswordStyling();
    }
}

function setHyperlinksToOtherProviders() {
    let socialFacebookA = document.getElementById("social-facebook");
    let socialGoogleA = document.getElementById("social-google");
    let copySocialFacebookA = document.getElementById("copy-social-facebook");
    let copySocialGoogleA = document.getElementById("copy-social-google");

    if (socialFacebookA && copySocialFacebookA) {
        copySocialFacebookA.href = socialFacebookA.getAttribute("href");
        copySocialGoogleA.href = socialGoogleA.getAttribute("href");
    }
}