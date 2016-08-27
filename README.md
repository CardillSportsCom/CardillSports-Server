## Stack

This web application uses the MEAN Stack:

#### MongoDB - NoSQL Database

You can install and setup mongodb locally to use a local instance of the databse, but a remote database is hosted on herokuapp for us. You can just use the remote database and not worry about installing this, since we only use the database for the draft-retrospective article at the moment.

#### Express - Javascript framework for building REST API inside your application

Used with node.js. Express is already included in the project repo as a node_module, you shouldn't have to install it yourself.

#### Node.js - Server-side framework

You will need to download and install node.js to develop this web application. Visit [Node.js](https://nodejs.org/en/) and follow the installation instructions.

[Visual Studio has provided some great tools for node.js development here](https://www.visualstudio.com/en-us/features/node-js-vs.aspx)

## Setup

1. Open your Mac terminal, Windows Command Prompt, PowerShell, Cygwin, etc..
2. Make sure you have node.js installed by typing 'node -v'
3. Navigate to the folder where the project is located using the terminal
4. From the root directory of this project, type the command 'nodemon'
5. That's it! Your web application should be running. Navigate to localhost:3000/ in your web browser to visit your web application running

## Project Structure

bin (not sure what this is for)

node_modules (contains all the third-party modules that we depend on)

server (contains all back-end logic)

package.json (declares necessary dependencies)

app.js (web application starter file)

## Important Files

#### app.js	

This is the starter file that kicks off the web application; it declares the routes() of our application, where to find the views, and the connection url to the mongo database.

#### views/index.ejs

All views for this application are found in the views folder. We are using the ejs view engine. Inside the views folder is a file named index.ejs which is loaded as the home page. Files with a .ejs extension are extremely similar to .html files, but is readable by the Express framework. In the body tag of index.ejs we use the "ng-app" attribute to declare that the AngularJS framework will be controlling the front-end. You'll notice a "<ui-view></ui-view>" in the body, this is where Angular will dynamically load content for the application. This website is actually a single-page application. We are always on the index.ejs page, but Angular dynamically swaps content in and out of the <ui-view></ui-view> section in that one page. You should declare all css stylesheets, and javascript files here.

#### server/routes

From the server perspective we only have two routes, default and api. The whole site is hosted on the default route, while the api route describes the different REST endpoints that our server exposes. Any client can hit these endpoints (ie. Google Chrome Postman, Terminal `curl` command, our Angular client code).
Within the default route, there are several different 'states' in our single-page web application (An article, home, about us, etc...). Those invididual states are defined using the Angular module 'state-provider' in the client code (public/js/cardillApp.js) 
