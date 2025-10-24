var htmlSettingsNotifications = getResource("html/settings-notifications.html");

/**
 * Additional Notifications
 */
waitForKeyElements(".auto-refill-fieldset + fieldset > table", addAdditionalNotifications, false);
function addAdditionalNotifications(el) {
  $(el).after(htmlSettingsNotifications)

  // select all regions
  $(el).closest('fieldset').on('click', '.se-select-all-regions', function(e) {
    e.preventDefault()
    alert("select them all, ash")
  })

  // select all states
  $(el).closest('fieldset').on('click', '.se-select-all-states', function(e) {
    e.preventDefault()
    alert("select them all, ash2")
  })

}


waitForKeyElements(".block-from-countries", addAdditionalNotifications2, false);
function addAdditionalNotifications2(el) {

}

waitForKeyElements(".block-from-states-regions", addAdditionalNotifications3, false);
function addAdditionalNotifications3(el) {

}


