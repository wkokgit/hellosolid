/*
  This file has the same functionalities as rdflib-basic-functions.js
  However, it uses the ldflex library to query linked-data.
*/

// Friend of a Friend
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
const userData = false

/*
  This function will load the profile box. 
  We use LDflex in this one.
*/
async function loadProfile(WEB_ID) {
  const userData = solid.data[WEB_ID];

  $('#profile').text(WEB_ID);
  $('#profile').attr("href", WEB_ID);

  addPropToProfile('fn', userData);
  addPropToProfile('role', userData);
  addPropToProfile('country-name', userData);

  // The userId contains the email as a value, so we have to get it out of there.
  const userId = await userData[VCARD('hasEmail').value];
  const mailLink = await userId[VCARD('value').value];

  // it starts with "mailto:" so we get rid of that.
  const mail = mailLink.value.slice(7);
  $('#mail').text(mail);

  // Display their friends 
  $('#friends').empty(); // Otherwise it will save from earlier website visits
  for await (const friend of userData[FOAF('knows').value])
    // "value" in this case is the WebId, you could also do "name"
    $('#friends').append(
      $('<li>').append(
        $('<a>').text(friend.value)
        .click(() => window.open(friend.value))));
}

/*
  
*/
async function addPropToProfile(propertyName) {
  let propertyValue = await userData[VCARD(propertyName).value];
  $('#' + propertyName).text(propertyValue);
  $('#' + propertyName + '-input').val(propertyValue);
}

/*
  Updates the data using LDflex
*/
async function updateData(propertyName) {
  // get the input value using jQuery
  const input = $('#' + propertyName + '-input').val()

  // Make sure your user has localhost as trusted application
  await userData[VCARD(propertyName).value].set(input);

  $('#' + propertyName).text(input);
}