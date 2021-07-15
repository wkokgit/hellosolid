# Hello Solid

This repository is created as part of my master project about Solid to help starting developers get the grips of developing a Solid client application. It is forked from [here](https://melvincarvalho.github.io/helloworld/), which is a repository created by Melvin Carvalho that I extended upon.

Here is a [Demo](https://wkokgit.github.io/hellosolid/) of my Hello Solid application.

When running locally, it is adviced to run the application using the [http-server](https://www.npmjs.com/package/http-server) npm package. I did this to test this project. 

Run ```http-server``` in terminal at the project location and go to the ip address in your browser to open the application. 


## Common Errors

#### Data is not shown or updated
Make sure you have either your localhost (when running locally) or the website in your trusted applications in your pod. You can do this by logging into your pod provider, go to "preferences" in the menu top-right, and add the website to the list with Read, Write and Append access control. 

#### Login error
When logging in using the popup, sometimes it shows a redirect error. Then you have to change the popupUri in main.js.
