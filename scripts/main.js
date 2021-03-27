//import data from "/scripts/solid-query-ldflex.bundle.js";

window.onload = function() {

//   console.error = console.debug = console.info =  console.log = (function (old_function, div_log) { 
//     return function (text) {
//         old_function(text);
//         div_log.innerHTML += text + '<br />';
//     };
// } (console.log.bind(console), document.getElementById("error-log")));

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
    const fullName = store.any($rdf.sym(person), FOAF('name'));
    const nickname = store.any($rdf.sym(person), FOAF('nick'));
    $('#fullName').text(fullName && fullName.value);
    $('#full').val(fullName && fullName.value);
    $('#nick').val(nickname && nickname.value);
    // Display their friends
    const friends = store.each($rdf.sym(person), FOAF('knows'));

    console.log("Loading friends...")
    if(friends.length == 0) {
      $('#friends').text("You have no friends :(");
    } else {
      $('#friends').empty();
      friends.forEach(async (friend) => {
        await fetcher.load(friend);
        const fullName = store.any(friend, FOAF('name'));
        $('#friends').append(
          $('<li>').append(
            $('<a>').text(fullName && fullName.value || friend.value)
                    .click(() => $('#profile').val(friend.value))
                    .click(loadProfile)));
      });
    }
    console.log("Friends loaded")
  }

//   $('#updateName').click(async function setNameAndNicknames() {
//     console.log("Updating...")
//     const store = $rdf.graph();
//     const fetcher = new $rdf.Fetcher(store, {});
//     const person = $('#profile').val();
//     const fullName = $('#full').val();
//     await fetcher.load(person);
//     const me = $rdf.sym(person);
//     const updater = new $rdf.UpdateManager(store);
    
//     const updatePromise = new Promise((resolve) => {
//       const deletions = store.statementsMatching(me, $rdf.sym('http://xmlns.com/foaf/0.1/name'), null, me.doc());
//       const additions = $rdf.st(me, $rdf.sym('http://xmlns.com/foaf/0.1/name'), new $rdf.Literal(fullName), me.doc());
//       updater.update(deletions, additions, resolve);
//     });
//     console.log("Sending update...")
//     await updatePromise;
//     console.log("Response received")

//   // const updatePromise2 = new Promise((resolve) => {
//   //   const deletions = store.statementsMatching(me, $rdf.sym('http://xmlns.com/foaf/0.1/nick'), null, me.doc());
//   //   const additions = nicknames.map(nickname => st(me, $rdf.sym('http://xmlns.com/foaf/0.1/nick'), new $rdf.Literal(nickname), me.doc()));
//   //   updater.update(deletions, additions, resolve);
//   // });
//   // await updatePromise;
// })

  $('#updateName').click(async function setNameAndNicknames() {
      const webId = $('#profile').val();
      const person = solid.data[webId];
      console.log(await person);
      await person['http://xmlns.com/foaf/0.1/name'].set($('#full').val());
  })

}