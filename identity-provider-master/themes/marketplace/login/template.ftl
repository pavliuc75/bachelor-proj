<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
              rel="stylesheet">
        <meta name="robots" content="noindex, nofollow">

        <title>Camera de Comerț și Industrie a Republicii Moldova</title>
        <link rel="icon" href="${url.resourcesPath}/img/favicon.png"/>

        <#if properties.styles?has_content>
            <#list properties.styles?split(' ') as style>
                <link href="${url.resourcesPath}/${style}" rel="stylesheet"/>
            </#list>
        </#if>
        <#if properties.scripts?has_content>
            <#list properties.scripts?split(' ') as script>
                <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
            </#list>
        </#if>
    </head>

    <body>
    <nav class="h-24 flex flex-shrink-0 border-b border-mid-gray border-solid justify-center">
        <div class="container flex flex-shrink-0 items-center">
            <a href="http://localhost:8080/#/" class="mr-8 c-a" style="width: 21px; height: 24px">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left" role="img"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                     class="text-dark-blue svg-inline--fa fa-arrow-left fa-xl">
                    <path fill="currentColor"
                          d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                          class=""></path>
                </svg>
            </a>
            <a class="c-a" href="http://localhost:8080/#/">
                <img id="logo" alt="" class="w-20">
<#--                <span class="text-2xl font-bold text-dark-blue underline hover:no-underline">abobus</span>-->
            </a>
            <div class="flex grow">
            </div>
            <a class="c-a" id="copy-language-en">
                <button type="button"
                        class="flex flex-none items-center tracking-[unset] underline hover:no-underline hover-text-dark-blue">
                    <span class="c-text-12">en</span></button>
            </a>
            <a class="c-a ml-1" id="copy-language-ro">
                <button type="button"
                        class="flex flex-none items-center tracking-[unset]  underline hover:no-underline hover-text-dark-blue">
                    <span class="c-text-12">ro</span></button>
            </a>
        </div>
    </nav>
    <main class="container flex self-center flex-col my-16 max-w-3xl">
        <#nested "header">
        <div class="flex flex-none flex-col w-full mt-4" style="max-width: calc(384px);">
            <#nested "form">
            <div style="display: none"><#nested "info"></div>
        </div>


        <#--        hidden-->
        <div style="display: none" class="${properties.kcLocaleMainClass!}" id="kc-locale">
            <div id="kc-locale-wrapper" class="${properties.kcLocaleWrapperClass!}">
                <div id="kc-locale-dropdown" class="${properties.kcLocaleDropDownClass!}">
                    <a href="#" id="kc-current-locale-link">${locale.current}</a>
                    <ul class="${properties.kcLocaleListClass!}">
                        <#list locale.supported as l>
                            <li class="${properties.kcLocaleListItemClass!}">
                                <a class="${properties.kcLocaleItemClass!}" id="${l.label}"
                                   href="${l.url}">${l.label}</a>
                            </li>
                        </#list>
                    </ul>
                </div>
            </div>
        </div>
    </main>
    </body>
    </html>
<#--    add lang selector, and all other nested and generated text-->
<#--    add icon and title-->
</#macro>
