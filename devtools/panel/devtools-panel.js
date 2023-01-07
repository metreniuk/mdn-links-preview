Skip to content
Search or jump to…
Pull requests
Issues
Codespaces
Marketplace
Explore
 
@metreniuk 
mdn
/
webextensions-examples
Public
Code
Issues
50
Pull requests
13
Actions
Security
Insights
webextensions-examples/devtools-panels/devtools/panel/devtools-panel.js /
@yfdyh000
yfdyh000 Update eslint and .travis.yml (#259)
…
Latest commit 050b5fa on Aug 11, 2017
 History
 2 contributors
@yfdyh000@hellosct1
72 lines (68 sloc)  2.05 KB

/**
Handle errors from the injected script.
Errors may come from evaluating the JavaScript itself
or from the devtools framework.
See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/devtools.inspectedWindow/eval#Return_value
*/
function handleError(error) {
  if (error.isError) {
    console.log(`Devtools error: ${error.code}`);
  } else {
    console.log(`JavaScript error: ${error.value}`);
  }
}

/**
Handle the result of evaluating the script.
If there was an error, call handleError.
*/
function handleResult(result) { 
  if (result[1]) {
    handleError(result[1]);
  }
}

/**
Handle the result of evaluating the jQuery test script.
Log the result of the test, or
if there was an error, call handleError.
*/
function handlejQueryResult(result) { 
  if (result[0] !== undefined) {
    console.log(`jQuery: ${result[0]}`);
  } else if (result[1]) {
    handleError(result[1]);
  }      
}
/**
When the user clicks the 'jquery' button,
evaluate the jQuery script.
*/
const checkjQuery = "typeof jQuery != 'undefined'";
document.getElementById("button_jquery").addEventListener("click", () => {
  browser.devtools.inspectedWindow.eval(checkjQuery)
    .then(handlejQueryResult);
});   
/**
When the user clicks each of the first three buttons,
evaluate the corresponding script.
*/
const evalString = "$0.style.backgroundColor = 'red'";
document.getElementById("button_background").addEventListener("click", () => {
  browser.devtools.inspectedWindow.eval(evalString)
    .then(handleResult);
});

const inspectString = "inspect(document.querySelector('h1'))";
document.getElementById("button_h1").addEventListener("click", () => {
    browser.devtools.inspectedWindow.eval(inspectString)
    .then(handleResult);  
}); 

/**
When the user clicks the 'message' button,
send a message to the background script.
*/
const scriptToAttach = "document.body.innerHTML = 'Hi from the devtools';";
document.getElementById("button_message").addEventListener("click", () => {
  browser.runtime.sendMessage({
    tabId: browser.devtools.inspectedWindow.tabId,
    script: scriptToAttach
  });
});
Footer
© 2023 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
webextensions-examples/devtools-panel.js at main · mdn/webextensions-examples