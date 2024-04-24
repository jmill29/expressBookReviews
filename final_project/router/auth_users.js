const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  for (let user of users) {
    if (user.username === username) {
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  for (let user of users) {
    if (user.username === username && user.password === password) {
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send(JSON.stringify({
      message: "Unable to login. Please include both a username and a password."
    }, null, 4));
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'user_access', { expiresIn: 60 * 60 });

    req.session.auth = {
      accessToken,username
    };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(400).send("Invalid Login. Check username and password.");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;