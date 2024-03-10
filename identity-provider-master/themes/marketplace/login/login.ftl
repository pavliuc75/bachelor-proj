<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section = "header">
        <h2> ${msg("doLogIn")} </h2>
    <#elseif section = "form">
        <form onsubmit="login.disabled = true; return true;" action="${url.loginAction}"
              method="post">
            <div class="flex flex-none flex-col w-full" style="max-width: calc(384px);">
                <label for="username"
                       class="inline-block c-text-14 mb-0.5">${msg("email")}</label>
                <div class="flex flex-none">
                    <input id="username" name="username" value="${(login.username!'')}" type="text"
                           class="w-full tracking-[unset] border border-solid border-mid-gray rounded-lg h-12 px-4 focus-visible:outline-none focus-visible-border-dark-blue focus-visible:border-2">
                </div>
            </div>
            <div class="flex flex-none flex-col w-full mt-8" style="max-width: calc(384px);">
                <label for="password"
                       class="inline-block c-text-14 mb-0.5">${msg("password")}</label>
                <div class="flex flex-none">
                    <input oninput="clearPasswordErrorText()" id="password" name="password" type="password"
                           autocomplete="on"
                           class="w-full tracking-[unset] border border-solid border-mid-gray rounded-lg h-12 px-4 focus-visible:outline-none focus-visible-border-dark-blue focus-visible:border-2">
                </div>
                <span style="display: none" id="password-error-text"
                      class="block c-text-12 mt-1 text-error ml-4 ml-4">${kcSanitize(messagesPerField.getFirstError('username', 'password'))?no_esc}</span>
            </div>
            <div class="flex flex-row items-center gap-8 mt-8 flex-wrap">
                <button
                        type="submit"
                        class="flex flex-none items-center tracking-[unset] hover-text-dark-blue hover-border-dark-blue border border-solid border-mid-gray rounded-lg self-start h-14 px-5">
                    <span class="c-text-14">${msg("doContinue")}</span>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                         class="svg-inline--fa fa-arrow-right fa-xs ml-3"
                         style="width: 10.5px; height: 12px">
                        <path fill="currentColor"
                              d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                              class=""></path>
                    </svg>
                </button>
                <a class="c-a" href="${url.loginResetCredentialsUrl}">
                    <button type="button"
                            class="flex flex-none items-center tracking-[unset] underline hover:no-underline hover-text-dark-blue">
                        <span class="c-text-12">${msg("doForgotPassword")}</span></button>
                </a>
            </div>
            <span class="block text-sm leading-171 font-bold mt-16"> ${msg("identity-provider-login-label")}</span>
            <div class="mt-4 flex self-start">
                <a class="c-a" href="" id="copy-social-facebook">
                    <button type="button"
                            class="flex flex-none items-center tracking-[unset] border border-solid border-mid-gray hover-text-dark-blue hover-border-dark-blue rounded-lg h-8 px-2">
                        <svg class="mr-2" style="width: 10.5px; height: 12px" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 320 512">
                            <path fill="currentColor"
                                  d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                        </svg>
                        <span class="c-text-12">${msg("signInWithFacebook")}</span></button>
                </a>
            </div>
            <div class="mt-4 flex self-start">
                <a class="c-a" href="" id="copy-social-google">
                    <button type="button"
                            class="flex flex-none items-center tracking-[unset] hover-text-dark-blue hover-border-dark-blue border border-solid border-mid-gray rounded-lg h-8 px-2">
                        <svg class="mr-2" style="width: 10.5px; height: 12px" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 488 512">
                            <path fill="currentColor"
                                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                        </svg>
                        <span class="c-text-12">${msg("signInWithGoogle")}</span></button>
                </a>
            </div>
            <span class="block text-sm leading-171 font-bold mt-16"> ${msg("wantToCreateAnAccountInstead")}</span>
            <div class="self-start flex">
                <a class="c-a" href="http://localhost:8080/#/create-account">
                    <button
                            type="button"
                            class="flex flex-none items-center tracking-[unset] hover-text-dark-blue hover-border-dark-blue border border-solid border-mid-gray rounded-lg self-start mt-4 h-8 px-2">
                        <span class="c-text-12">${msg("createAccount")}</span></button>
                </a>
            </div>

            <#--            hidden-->
            <ul style="display: none"
                class="${properties.kcFormSocialAccountListClass!} <#if social.providers?size gt 3>${properties.kcFormSocialAccountListGridClass!}</#if>">
                <#list social.providers as p>
                    <a id="social-${p.alias}"
                       class="${properties.kcFormSocialAccountListButtonClass!} <#if social.providers?size gt 3>${properties.kcFormSocialAccountGridItem!}</#if>"
                       type="button" href="${p.loginUrl}">
                        <#if p.iconClasses?has_content>
                            <i class="${properties.kcCommonLogoIdP!} ${p.iconClasses!}" aria-hidden="true"></i>
                            <span class="${properties.kcFormSocialAccountNameClass!} kc-social-icon-text">${p.displayName!}</span>
                        <#else>
                            <span class="${properties.kcFormSocialAccountNameClass!}">${p.displayName!}</span>
                        </#if>
                    </a>
                </#list>
            </ul>
            <input style="display: none" id="rememberMe" name="rememberMe" type="checkbox" checked>
        </form>
    </#if>
</@layout.registrationLayout>
