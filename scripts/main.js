window.onload = function() {
  // We will use this to display the sections
  let logout_section = document.getElementById('logout_section');
  let login_section = document.getElementById('login_section');

  /*
    Tracks the current user session and is being called at the bottom.
    First we check if a session currently exists, and if so 
    a new section will be shown and the profile will be loaded.
  */
  function sessionTracker() {
    solid.auth.trackSession(session => {
      if (session && session.webId) {
        logout_section.style.display = ''
        login_section.style.display = 'none'

        loadProfile(session.webId);
      } else {
        logout_section.style.display = 'none'
        login_section.style.display = ''
      }
    })
  }

  /*
    Updates the name of a user.
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
