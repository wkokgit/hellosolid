window.onload = function() {
  
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

        $('#profile').text(session.webId);
        $('#profile').val(session.webId);
      loadProfile();
    }
  });

  async function loadProfile() {
    console.log("VIEW")
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
    console.log("YOUR FRIENDS: ")
    console.log(friends)

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
  }

  $('#updateName').click(async function setNameAndNicknames() {
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store, {});
  const person = $('#profile').val();
  const fullName = $('#full').val();
  await fetcher.load(person);
  const me = $rdf.sym(person);
  const updater = new $rdf.UpdateManager(store);
  const updatePromise = new Promise((resolve) => {
    const deletions = store.statementsMatching(me, $rdf.sym('http://xmlns.com/foaf/0.1/name'), null, me.doc());
    const additions = $rdf.st(me, $rdf.sym('http://xmlns.com/foaf/0.1/name'), new $rdf.Literal(fullName), me.doc());
    updater.update(deletions, additions, resolve);
  });
  await updatePromise;

  // const updatePromise2 = new Promise((resolve) => {
  //   const deletions = store.statementsMatching(me, $rdf.sym('http://xmlns.com/foaf/0.1/nick'), null, me.doc());
  //   const additions = nicknames.map(nickname => st(me, $rdf.sym('http://xmlns.com/foaf/0.1/nick'), new $rdf.Literal(nickname), me.doc()));
  //   updater.update(deletions, additions, resolve);
  // });
  // await updatePromise;
})

}