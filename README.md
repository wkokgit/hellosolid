# Hello Solid
This repository is created as part of my master project about Solid to help starting developers get the grips of developing a Solid client application. It is forked from [here](https://melvincarvalho.github.io/helloworld/), which is a repository created by Melvin Carvalho that I extended upon.

Most of the functionalities are explained in the code, and on the website itself. Here is a [Demo](https://wkokgit.github.io/hellosolid/) of the Hello Solid application.

When testing, I used the [http-server](https://www.npmjs.com/package/http-server) npm package to run the project locally. 

After installing, run ```http-server``` in terminal at the project location and go to the ip address in your browser to open the application. 

## RDFLIB & LDFLEX
All functionalities for reading and writing linked-data are written in both [rdflib](http://linkeddata.github.io/rdflib.js/doc/) and [LDFLEX](https://ldflex.github.io/LDflex/). So there are 2 files which you can check, also, you have to edit the scripts in ```index.html``` to switch between them for testing. There are other ways for reading and writing data, but I wanted to give at least 2 examples.

## Common Errors
#### Data is not shown or updated
Make sure you have either your localhost (when running locally) or the website in your trusted applications in your pod. You can do this by logging into your pod provider, go to "preferences" in the menu top-right, and add the website to the list with Read, Write and Append access control. 

#### Login error
When logging in using the popup, sometimes it shows a redirect error. Then you have to change the popupUri in main.js.
