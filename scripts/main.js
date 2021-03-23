window.onload = function() {
  
  const $rdf = require(‘rdflib’)
  const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

  // Log the user in and out on click
  const popupUri = 'https://melvincarvalho.github.io/helloworld/popup.html';
  $('#login').click(() => solid.auth.popupLogin({ popupUri }));
  $('#logout').click(() => solid.auth.logout());

  // Update components to match the user's login status
  solid.auth.trackSession(session => {
    const loggedIn = !!session;
    $('#welcome').toggle(!loggedIn);
    $('#logout-section').toggle(loggedIn);
    if (loggedIn) {
      $('#user').text(session.webId);
      // Use the user's WebID as default profile
      if (!$('#profile').val())
        $('#profile').val(session.webId);
    }
  });

  $('#view').click(async function loadProfile() {
    console.log("VIEW")
    // Set up a local data store and associated data fetcher
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);

    // // Load the person's data into the store
    // const person = $('#profile').val();
    // await fetcher.load(person);

    // // Display their details
    // const fullName = store.any($rdf.sym(person), FOAF('name'));
    // $('#fullName').text(fullName && fullName.value);

    // // Display their friends
    // const friends = store.each($rdf.sym(person), FOAF('knows'));
    // $('#friends').empty();
    // friends.forEach(async (friend) => {
    //   await fetcher.load(friend);
    //   const fullName = store.any(friend, FOAF('name'));
    //   $('#friends').append(
    //     $('<li>').append(
    //       $('<a>').text(fullName && fullName.value || friend.value)
    //               .click(() => $('#profile').val(friend.value))
    //               .click(loadProfile)));
    // });
  });
}