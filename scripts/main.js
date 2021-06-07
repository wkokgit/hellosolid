window.onload = function() {

//   console.error = console.debug = console.info =  console.log = (function (old_function, div_log) { 
//     return function (text) {
//         old_function(text);
//         div_log.innerHTML += text + '<br />';
//     };
// } (console.log.bind(console), document.getElementById("error-log")));

  const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
  const n = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
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
      console.log("Logged in")
      $('#user').text(session.webId);
      // Use the user's WebID as default profile
      if (!$('#profile').val())
        $('#profile').text(session.webId);
        $('#profile').val(session.webId);
      loadProfile();
    }
  });


  async function loadProfile() {
    console.log("Loading profile for webID:")
    // Set up a local data store and associated data fetcher
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);
    
    // // Load the person's data into the store
    const person = $('#profile').val();
    console.log(person)
    await fetcher.load(person);
    // Display their details
    const fullName = store.any($rdf.sym(person), n('fn'));

    const nickname = store.any($rdf.sym(person), FOAF('nick'));
    const role = store.any($rdf.sym(person), n('role'));

    // The mail is stored in the user ID as a value and starts with mailto:YOURMAIL
    const personId = store.any($rdf.sym(person), n('hasEmail'));
    const mail = store.any($rdf.sym(personId), n('value')).value.slice(7);

    $('#fullName').text(fullName && fullName.value);
    $('#mail').text(mail);
    $('#role').text(role && role.value);
    $('#role-input').val(role && role.value);
    $('#fullName-input').val(fullName && fullName.value);
    // Display their friends 
    const friends = store.each($rdf.sym(person), FOAF('knows'));

    console.log("Loading friends...")
    if(friends.length == 0) {
      $('#friends').text("You have no friends :(");
    } else {
      $('#friends').empty();
      friends.forEach(async (friend) => {
        await fetcher.load(friend);
        const fullName = store.any(friend, n('fn'));
        $('#friends').append(
          $('<li>').append(
            $('<a>').text(fullName && fullName.value || friend.value)
                    .click(() => $('#profile').val(friend.value))
                    .click(loadProfile)));
      });
    }
    console.log("Friends loaded")
  }

  $('#updateName').click(async function setNameAndNicknames() {
      console.log("Updating name...");
      const webId = $('#profile').val();
      const person = solid.data[webId];
      const fulln = await person[n('fn').value];
      console.log(fulln)
      // Make sure your user has localhost as trusted application
      await person[n('fn').value].set($('#fullName-input').val());
      console.log("Name updated");
      loadProfile()
  })

  $('#updateRole').click(async function setNameAndNicknames() {
    console.log("Updating role...");
    const webId = $('#profile').val();
    const person = solid.data[webId];
    const role = await person[n('role').value];
    // Make sure your user has localhost as trusted application
    await person[n('role').value].set($('#role-input').val());
    console.log("Role updated");
    loadProfile()
  })

}
