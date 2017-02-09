// tryShootAzure tries to find the big bad flashing warning Microsoft shows us
// and if found copies the needed resource name into the needed input
var tryShootAzure = function() {
  // Try to find the warning
  var el = document.querySelector('[data-bind="text: warning"]')

  if (el != null) {
    // The warnings are not similar on all blades, so we need some common word
    if (el.textContent.indexOf("undone") != -1) {
      // Get the resource name from the warning using regex, note that MS did a
      // great job, and in some places we have quotation marks, and some places
      // apostrophes
      var badMicrosoftRegex = /"(.+?)"/g;
      var badderMicrosoftRegex = /'(.+?)'/g;
      var match = badMicrosoftRegex.exec(el.textContent);
      if (match == null) {
        match = badderMicrosoftRegex.exec(el.textContent);
      }

      // If we had success in hunting down that pesky resource name, put it
      // where it belongs!
      if (match != null) {
        if (match.length == 2) {
          var elInp = document
                  .querySelector('[data-bind="pcControl: confirmationEditor"],'
                  + ' [data-bind="pcTextBox: confirmationEditor"]')
          if (elInp != null) {
            var elInpReal = elInp.querySelector("input")
            if (elInpReal != null) {
              elInpReal.value = match[1]

              // Inform everybody we changed the input
              var chEvent = new Event('change');
              elInpReal.dispatchEvent(chEvent)
            }
          }
        }
      }
    }
  }
}

// Create an observer, to catch all events, one of which can be the Azure blade
// opening
var observer = new MutationObserver(tryShootAzure);
observer.observe(document, { childList: true, subtree: true });
