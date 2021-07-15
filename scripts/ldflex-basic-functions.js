/*
  This file has the same functionalities as rdflib-basic-functions.js
  However, it uses the ldflex library to query linked-data.
*/

const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

/*
  This function will load the profile box. 
  We use LDflex in this one.
*/
async function loadProfile(WEB_ID) {
  window.WEB_ID = WEB_ID;
  userData = solid.data[WEB_ID]; // IMPORTANT: userData can change when doing a PATCH so don't make it a global const

  $('#profile').text(WEB_ID);
  $('#profile').attr("href", WEB_ID);

  addPropToProfile('fn', userData);
  addPropToProfile('role', userData);
  addPropToProfile('country-name', userData);

  // To get the email, we need to query hasEmail first,
  // because in this value, the userId is stored. 
  // This is used to get the email afterwards. (Check the XML Source of your POD's profile card for more information)  
  let userId = await userData[VCARD('hasEmail').value];
  let mailLink = await userId[VCARD('value').value];

  // it starts with "mailto:" so we get rid of that.
  let mail = mailLink.value.slice(7);
  $('#mail').text(mail);

  // display your friends 
  $('#friends').empty(); // Otherwise it will save from earlier website visits
  for await (const friend of userData[FOAF('knows').value])
    // "value" in this case is your friends WebId, you could also do "name"
    $('#friends').append(
      $('<li>').append(
        $('<a>').text(friend.value)
        .click(() => window.open(friend.value))));
}

/*
  Retrieves a property from the profile document.
  First we do a query to find the property value, for example a name of a person.
  After that it is updated on the webpage using jQuery.
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
  userData = solid.data[WEB_ID];
  // get the input value using jQuery
  let input = $('#' + propertyName + '-input').val()

  // use .set() to set the correct value
  await userData[VCARD(propertyName).value].set(input);

  $('#' + propertyName).text(input);
}