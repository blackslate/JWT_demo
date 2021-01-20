// Load in our dependencies
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken'); // after: npm install jsonwebtoken

const PORT = 3000
const SECRET = "weak_secret";

// Register the home route that displays a welcome message
// This route can be accessed without a token
app.get('/', function(req, res){
  res.send("Welcome to our API");
})

// Register the route to get a new token
// In a real world scenario we would authenticate user credentials
// before creating a token, but for simplicity accessing this route
// will generate a new token that is valid for 2 minutes
app.get('/token', function(req, res){
  const payload  = {
    iss:"dci"
  , username:"blackslate"
  }
  const options  = { expiresIn: 120 } // seconds = 2 minutes
  const callback = undefined // jwt.sign will be synchronous

  const token = jwt.sign(
    payload
  , SECRET
  , options
  , callback
  );

  res.send(token)
})

// Register a route that requires a valid token to view data
app.get('/api', function(req, res){
  console.log(req.query)
  const token = req.query.token;
  const options = {
    // issuer: "dci"
  }

  function callback(err, decoded) {
    if(!err){
      const secrets = {
        "accountNumber": "938291239"
      , "pin": "11289"
      , "account": "Finance"
      };
      res.json(secrets);
    } else {
      res.send(err);
    }
  }

  jwt.verify(token, SECRET, options, callback)
})


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})