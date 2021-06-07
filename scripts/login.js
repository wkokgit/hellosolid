window.onload = function() {

  const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
  const n = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

  let logout = document.getElementById('logout-section')
  let welcome = document.getElementById('welcome')
  let user = document.getElementById('user')

  function renderLogin(session) {
    let webId = session.webId
    logout.style.display = ''             
    welcome.style.display = 'none'             
    
    console.log(webId)

    if (!$('#profile').val())
      $('#profile').text(session.webId);
      $('#profile').val(session.webId);

    loadProfile()
  }
          
  function renderLogout() {

    logout.style.display = 'none'             
    welcome.style.display = ''             
  }
      
  function handleLogin() {
    // login event
    solid.auth.trackSession(session => {        
      if (session && session.webId) {
        renderLogin(session)
      } else {
        renderLogout()
      }
    })                        
  }

  // Log the user in and out on click        
  function addListeners() {
    let login = document.getElementById('login')
    let logout = document.getElementById('logout')
    
    // login and logout buttons
    const popupUri = 'https://melvincarvalho.github.io/helloworld/popup.html'
    console.log(login)

    login.addEventListener('click', () => solid.auth.popupLogin({ popupUri }))
    logout.addEventListener('click', () => solid.auth.logout())
      
    handleLogin()

  }

  async function loadProfile() {
    console.log("Loading profile for webID:")
    // Set up a local data store and associated data fetcher
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);
    
    // // Load the person's data into the store
    const person = $('#profile').val();
    await fetcher.load(person);

    console.log("fetched")
    // Display their details
    const fullName = store.any($rdf.sym(person), n('fn'));

    
    const nickname = store.any($rdf.sym(person), FOAF('nick'));
    console.log(nickname)
    const role = store.any($rdf.sym(person), n('role'));
    
    // The mail is stored in the user ID as a value and starts with mailto:YOURMAIL
    const personId = store.any($rdf.sym(person), n('hasEmail'));
    console.log(personId)
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
                
  addListeners()     
  }
