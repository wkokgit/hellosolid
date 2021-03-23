window.onload = function() {
  console.log("login.js loaded")

  function renderLogin(session) {
        let logout = document.getElementById('logout')
        let welcome = document.getElementById('welcome')
        let user = document.getElementById('user')
        let webId = session.webId
        logout.style.display = ''             
        welcome.style.display = 'none'             
        
        console.log(session)
        user.textContent = webId
        user.setAttribute('href', webId)
      }
          
      function renderLogout() {
        let logout = document.getElementById('logout')
        let welcome = document.getElementById('welcome')

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
                
      addListeners()   
    }