window.onload = function() {

  const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
  const n = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
  let login = document.getElementById('login')
  let logout_section = document.getElementById('logout_section')
  let logout = document.getElementById('logout')
  let login_section = document.getElementById('login_section')
  let user = document.getElementById('user')

  function renderLogin(session) {
    logout_section.style.display = ''             
    login_section.style.display = 'none'             
    

    if (!$('#profile').val())
      $('#profile').text(session.webId);
      $('#profile').val(session.webId);

    loadProfile()
  }
          
  function renderLogout() {

    logout_section.style.display = 'none'             
    login_section.style.display = ''             
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
    
    // login and logout buttons
    const popupUri = 'https://wkokgit.github.io/helloworld/popup.html'
    console.log(login)

    login.addEventListener('click', () => solid.auth.popupLogin({ popupUri }))
    logout.addEventListener('click', () => solid.auth.logout())
      
    handleLogin()

  }

  async function loadProfile() {
    // Set up a local data store and associated data fetcher
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);
    
    // // Load the person's data into the store
    const person = $('#profile').val();
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
  }

    $('#updateName').click(async function setNameAndNicknames() {
      const webId = $('#profile').val();

      const person = solid.data[webId];

      const fulln = await person[n('fn').value];
      // Make sure your user has localhost as trusted application
      await person[n('fn').value].set($('#fullName-input').val());
      loadProfile()
  })

  $('#updateRole').click(async function setNameAndNicknames() {
    const webId = $('#profile').val();
    const person = solid.data[webId];
    const role = await person[n('role').value];
    // Make sure your user has localhost as trusted application
    await person[n('role').value].set($('#role-input').val());
    loadProfile()
  })
                
  addListeners()     
  }
