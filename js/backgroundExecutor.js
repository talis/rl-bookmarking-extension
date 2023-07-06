import {getActiveTenant} from "/js/tenants.js";

async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// let tab = await getCurrentTab();

/**
 * Background script.
 *
 * This only does anything when the bookmarking button is clicked
 */
// chrome.action.onClicked.addListener(function (currentTab) {
//     // If no institution has been set, go to the options page to set one
//     getActiveTenant(function (tenant) {
//         const tab = await getCurrentTab();
//         if (!tenant) {
//             // browser.runtime.openOptionsPage() not supported by ms-edge, so here's a workaround
//             chrome.tabs.create({
//                 url: 'options.html'
//             });
//         } else {
//             chrome.scripting.executeScript(
//               {
//                   target: {tabId: tab.id},
//                   files: ['/js/bookmarker.js']
//               }, function () {
//                   chrome.tabs.sendMessage(currentTab.id, {tenant: tenant});
//               });
//         }
//     });
// });

chrome.action.onClicked.addListener(bookmark)

async function bookmark() {
    try {
        const tab = await getCurrentTab();
        getActiveTenant(function (tenant) {
            if (!tenant) {
                // browser.runtime.openOptionsPage() not supported by ms-edge, so here's a workaround
                chrome.tabs.create({
                    url: 'options.html'
                });
            } else {
                chrome.scripting.executeScript(
                  {
                      target: {tabId: tab.id},
                      files: ['/js/bookmarker.js']
                  }, function () {
                      chrome.tabs.sendMessage(tab.id, {tenant: tenant});
                  });
            }
        });
    } catch (error) {
        console.error(error);
    }
}
