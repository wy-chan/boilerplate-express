var bodyParser = require("body-parser");
var express = require('express');
var app = express();

console.log("Hello World");
/*
In Express, routes takes the following structure: app.METHOD(PATH, HANDLER). 

 - METHOD is an http method in lowercase. 

 - PATH is a relative path on the server (it can be a string, or even a regular expression). 

 - HANDLER is a function that Express calls when the route is matched. 

 - Handlers take the form function(req, res) {...}, where req is the request object, and res is the response object.
*/

//Express evaluates routes from top to bottom, and executes the handler for the first match
//app.route(path).get(handler).post(handler)

/*HTTP methods:

- POST (sometimes PUT) - Create a new resource using the information sent with the request,

- GET - Read an existing resource without modifying it,

- PUT or PATCH (sometimes POST) - Update a resource using the data sent,

- DELETE => Delete a resource.
*/
//POST is the default method used to send client data with HTML forms.
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/name", function(req, res) {
  // Handle the data in the request
  var string = req.body.first + " " + req.body.last;
  res.json({ name: string });
});

//Another common way to get input from the client is by encoding the data after the route path, using a query string.
app.get("/name", (req, res) => {
  var firstName = req.query.first;
  var lastName = req.query.last;
  // OR you can destructure and rename the keys
  var { first: firstName, last: lastName } = req.query;
  // Use template literals to form a formatted string
  res.json({
    name: `${firstName} ${lastName}`//?first=firstname&last=lastname
  });
});

//we have to allow users to communicate to us what they want to get from our service
//Route parameters are named segments of the URL, delimited by slashes (/). 
//The captured values can be found in the req.params object.
app.get("/:word/echo", (req, res) => {
  const { word } = req.params;
  res.json({
    echo: word
  });
});

//Middleware can be mounted at a specific route using app.METHOD(path, middlewareFunction)
app.get('/now', function(req, res, next) {
  req.time = new Date().toString();  // Hypothetical synchronous operation
  next();
}, function(req, res) {
  res.json({time: req.time});//response with json object
});

//Build a simple logger. For every request, it should log to the console a string taking the following format: method path - ip
app.use(function middleware(req, res, next) {
  var string = req.method + " " + req.path + " - " + req.ip;
  console.log(string);
  next();
});

//app.use(path, middlewareFunction)to mount a middleware function at root level
//middleware express.static(path)- for static assets
app.use("/public", express.static(__dirname + "/public"));

//the .env file is a hidden file that is used to pass environment variables to your application.
//Note: If you are using Replit, you cannot create a .env file. Instead, use the built-in SECRETS tab to add the variable.
const mySecret = process.env['MESSAGE_STYLE'];
app.get("/json", (req, res) => {
if (process.env.MESSAGE_STYLE === "uppercase") {
  res.json({"message": "HELLO JSON"});
} else {
  res.json({"message": "Hello json"});
};
});

//A REST (REpresentational State Transfer) API allows data exchange in a simple way, without the need for clients to know any detail about the server.
//object structure {key: data}
//Then point your browser to your-app-url/json, you should see the message on the screen.
app.get("/json", (req, res) => {
  res.json({"message": "Hello json"});

});

//You can respond to requests with a file using the res.sendFile(path) method.
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

//Use the app.get() method to serve the string "Hello Express" to GET requests matching the / (root) path.
app.get("/", (req, res) => {
  res.send("Hello Express");
});































 module.exports = app;
