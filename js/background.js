/**
 * Background script.
 * 
 * This only does anything when the bookmarking button is clicked
 */
chrome.browserAction.onClicked.addListener(function(tab) {
    // If no institution has been set, go to the options page to set one
    getActiveTenant(function (tenantCode) {
        if (!tenantCode) {
            if (window.confirm(chrome.i18n.getMessage('noTenantAlert'))) {
                chrome.runtime.openOptionsPage();
            }
        }
        // Edge does not support the promise-based APIs (chrome.*), but, conveniently, it also 
        // requires the bookmarker to be injected via a content_script (whereas other browsers 
        // seem fine as background scripts), so we'll use that to differentiate
        if (this.browser) {
            browser.tabs.executeScript(
                { code: 'bookmarkPage("' + tenantCode + '")'}
            );
        } else {
            // This is effectively the same as bookmarker.js
            var bookmarkCode = 'var bookmarker = document.createElement(\'script\');' +
                'bookmarker.setAttribute(\'src\', ' +
                '\'https://bookmarking.talis.com/' + tenantCode + '/parser?bookmarkButtonVersion=1&uri=\' + ' +
                'encodeURIComponent(encodeURI(window.location.href)) + \'&bookmarkVersion=1&title=\' + ' +
                'encodeURIComponent(document.title) + \'&hasJquery=no\');document.body.appendChild(bookmarker);';
            chrome.tabs.executeScript(
                tab.id,
                { code: bookmarkCode}
            );
        }
    });
});