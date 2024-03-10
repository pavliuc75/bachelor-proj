document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        setLanguageSelectorCopies();
        runLoginScripts();
        runLoginResetPasswordScripts();
        runLoginUpdatePasswordScripts();
    }, 0)
})

function setLanguageSelectorCopies() {
    let copyLanguageEnglishA = document.getElementById('copy-language-en');
    let copyLanguageRomanianA = document.getElementById('copy-language-ro');
    let currentLocaleA = document.getElementById('kc-current-locale-link');
    let languageEnglishA = document.getElementById('English');
    let languageRomanianA = document.getElementById('ro');

    if (languageRomanianA) {
        copyLanguageEnglishA.href = languageEnglishA.getAttribute('href');
        copyLanguageRomanianA.href = languageRomanianA.getAttribute('href');
        if (currentLocaleA.innerText === 'English') {
            copyLanguageEnglishA.classList.add('text-mid-gray', 'pointer-events-none');
            copyLanguageEnglishA.children[0]?.classList.add('no-underline');
        } else if (currentLocaleA.innerText === 'ro') {
            copyLanguageRomanianA.classList.add('text-mid-gray', 'pointer-events-none');
            copyLanguageRomanianA.children[0]?.classList.add('no-underline');
        }
    }
}


//TODO: add borders to <>buttons