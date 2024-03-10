<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
    <#if section = "header">
        <h2> ${msg("resetPassword")} </h2>
    <#elseif section = "form">
        <form action="${url.loginAction}" method="post">
            <div class="flex flex-none flex-col w-full" style="max-width: calc(384px);">
                <label for="email"
                       class="inline-block c-text-14 mb-0.5">${msg("email")}</label>
                <div class="flex flex-none">
                    <input oninput="clearEmailErrorText()" id="email" name="username" type="text"
                           value="${(auth.attemptedUsername!'')}"
                           class="w-full tracking-[unset] border border-solid border-mid-gray rounded-lg h-12 px-4 focus-visible:outline-none focus-visible-border-dark-blue focus-visible:border-2">
                </div>
                <span style="display: none" id="email-error-text"
                      class="block c-text-12 mt-1 text-error ml-4 ml-4">${kcSanitize(messagesPerField.get('username'))?no_esc}</span>
            </div>
            <div class="flex flex-row items-center gap-8 mt-8 flex-wrap">
                <a class="c-a" href="${url.loginUrl}">
                    <button type="button"
                            class="flex flex-none items-center tracking-[unset] underline hover:no-underline hover-text-dark-blue">
                        <span class="c-text-12">${msg("backToLogin")}</span></button>
                </a>
                <button
                        type="submit"
                        class="flex flex-none items-center tracking-[unset] hover-text-dark-blue hover-border-dark-blue border border-solid border-mid-gray rounded-lg self-start h-14 px-5">
                    <span class="c-text-14">${msg("sendResetPasswordEmail")}</span>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                         class="svg-inline--fa fa-arrow-right fa-xs ml-3"
                         style="width: 10.5px; height: 12px">
                        <path fill="currentColor"
                              d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                              class=""></path>
                    </svg>
                </button>
            </div>
        </form>
    </#if>

</@layout.registrationLayout>
