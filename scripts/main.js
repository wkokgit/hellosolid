window.onload = function() {

  // Friend of a Friend
  const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
  const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
  let logout_section = document.getElementById('logout_section');
  let login_section = document.getElementById('login_section');
  let WEB_ID = false

  /*
    Tracks the current user session and is being called at the bottom.
    First we check if a session currently exists, and if so 
    the other section will be shown and the profile will be loaded.
  */
  function sessionTracker() {
    solid.auth.trackSession(session => {
      if (session && session.webId) {
        logout_section.style.display = ''
        login_section.style.display = 'none'
        WEB_ID = session.webId

        loadProfileLDflex();
      } else {
        logout_section.style.display = 'none'
        login_section.style.display = ''
        WEB_ID = ''
      }
    })
  }

  /*
    This function will load the profile box. 
    We use rdflib in this one.
  */
  async function loadProfileRDFLIB() {
    const store = $rdf.graph(); // data structure to store graph data
    const me = store.sym(WEB_ID); // your profile
    const fetcher = new $rdf.Fetcher(store); // the 

    // The Fetcher is a 
    fetcher.load(me).then(response => {
      $('#profile').text(me.value);
      $('#profile').attr("href", me.value);

      addPropToProfileRDFLIB('fn', store, me);
      addPropToProfileRDFLIB('role', store, me);
      addPropToProfileRDFLIB('country-name', store, me);

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
    Makes sure the properties are shown in the profile box. 
    First we do a query to find the property value, for example a name of a person.
    After that it is updated on the webpage using jQuery.
  */
  function addPropToProfileRDFLIB(propertyName, store, me) {
    let propertyValue = store.any(me, VCARD(propertyName));
    $('#' + propertyName).text(propertyValue);
    $('#' + propertyName + '-input').val(propertyValue);
  }

    /*
    This function will load the profile box. 
    We use LDflex in this one.
  */
  async function loadProfileLDflex() {
    const userData = solid.data[WEB_ID];

    $('#profile').text(WEB_ID);
    $('#profile').attr("href", WEB_ID);

    addPropToProfileLDFlex('fn', userData);
    addPropToProfileLDFlex('role', userData);
    addPropToProfileLDFlex('country-name', userData);

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
    Uses LDFlex
  */
  async function addPropToProfileLDFlex(propertyName) {
    const userData = solid.data[WEB_ID];
    let propertyValue = await userData[VCARD(propertyName).value];
    $('#' + propertyName).text(propertyValue);
    $('#' + propertyName + '-input').val(propertyValue);
  }

  /*
    Updates the data using LDflex
  */
  async function updateData(propertyName) {
    const userData = solid.data[WEB_ID];

    // get the input value using jQuery
    const input = $('#' + propertyName + '-input').val()

    // Make sure your user has localhost as trusted application
    await userData[VCARD(propertyName).value].set(input);

    $('#' + propertyName).text(input);
  }

  /*
    Updates the name of a user. 
    Check the extra added comments for more info.
  */
  $('#updateFullName').click(async function updateFullName() {
    updateData("fn");
  })

  /*
    Updates the role of a user
  */
  $('#updateRole').click(async function updateRole() {
    updateData("role");
  })

  /*
    This is a demonstration for adding new data to your pod.
    The country-name property hasn't been set yet, which will happen here.
  */
  $('#updateCountry').click(async function updateTitle() {
    updateData("country-name");
  })

  /* 
    The Solid authentication package is used for the login. 
    Using popupLogin, we can use our popup, which handles the login 
    further with the pod provider.
  */
  $('#login').click(async function login() {
    //const popupUri = 'https://wkokgit.github.io/hellosolid/popup.html'
    // Use the Uri below when the error: "Mismatching redirect uri" is shown
    const popupUri = 'https://melvincarvalho.github.io/helloworld/popup.html'

    solid.auth.popupLogin({
      popupUri
    })
  })

  /* 
    We can simply logout by using the logout function of the Solid authentication package.
  */
  $('#logout').click(async function logout() {
    solid.auth.logout()
  })

  sessionTracker();
}