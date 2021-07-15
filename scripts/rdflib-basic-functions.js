/*
  This file has the same functionalities as ldflex-basic-functions.js
  However, it uses the rdflib library to query linked-data.
*/

const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

// 
const store = $rdf.graph(); // data structure to store graph data
const fetcher = new $rdf.Fetcher(store); // a helper object that allows read-write connections to be made over the web
const updater = new $rdf.UpdateManager(store); // a helper object that allows small patches to be made in real time


/*
  This function will load the profile box. 
  We use rdflib in this one.
*/
async function loadProfile(WEB_IDx) {
  window.WEB_ID = WEB_IDx;
  window.me = store.sym(WEB_ID); // your profile
  window.profile = me.doc();

  fetcher.load(me).then(response => {
    $('#profile').text(me.value);
    $('#profile').attr("href", me.value);

    addPropToProfile('fn');
    addPropToProfile('role');
    addPropToProfile('country-name');

    // To get the email, we need to query hasEmail first,
    // because in this value, the userId is stored. 
    // This is used to get the email afterwards. (Check the XML Source of your POD's profile card for more information)  
    const userId = store.any(me, VCARD('hasEmail'));
    const mailLink = store.any(userId, VCARD('value'));

    // it starts with "mailto:" so we get rid of that.
    const mail = mailLink.value.slice(7);
    $('#mail').text(mail);

    // Display their friends 
    $('#friends').empty(); // Otherwise it will save from earlier website visits
    store.each(me, FOAF('knows')).forEach(async(friend) => {
      await fetcher.load(friend);
      $('#friends').append(
        $('<li>').append(
          $('<a>').text(friend.value)
          .click(() => window.open(friend.value))));
    });
  });
}

/*
  Retrieves a property from the profile document and then sets the values in the document.
  First we do a query to find the property value, for example a name of a person.
  After that it is updated on the webpage using jQuery.
*/
function addPropToProfile(propertyName) {
  let propertyValue = store.any(me, VCARD(propertyName));
  $('#' + propertyName).text(propertyValue);
  $('#' + propertyName + '-input').val(propertyValue);
}

/*
  Updates / adds a data property like name or role. 
  The UpdateManager (at the top) is needed to be able to execute patches
  For more info go to: http://linkeddata.github.io/rdflib.js/doc/classes/updatemanager.html#update
*/
async function updateData(propertyName) {
  // get the input value using jQuery
  const input = $('#' + propertyName + '-input').val()
  let ins = $rdf.st(me, VCARD(propertyName), input, profile);
  let del = store.statementsMatching(me, VCARD(propertyName), null, me.doc());

  /*
    To use the update function, we need to add parameters that
    tell what needs to be deleted and inserted. 
    You could for example have multiple values and only want to update one.
  */
  await new Promise((resolve) => {
    updater.update(del, ins, resolve);
  });

  $('#' + propertyName).text(input);
}