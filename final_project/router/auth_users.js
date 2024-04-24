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
  const username = req.user.data;
  const isbn = req.params.isbn;
  const newReview = req.query.review;

  if (books[isbn]) {
    let alreadyReviewed;
    if (books[isbn].reviews[username]) {
      alreadyReviewed = true;
    } else {
      alreadyReviewed = false;
    }

    books[isbn].reviews[username] = newReview;

    let resMsg;
    if (alreadyReviewed) {
      resMsg = "You're book review has been successfully edited.";
    } else {
      resMsg = "You're book review has been successfully created.";
    }
    res.status(200).send(JSON.stringify({
      message: resMsg
    }, null, 4));
  } else {
    res.status(404).send("Book not found. Please include a valid ISBN.");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).send(JSON.stringify({
        message: "User review successfully deleted."
      }, null, 4));
    } else {
      return res.status(404).send(JSON.stringify({
        message: "No user review found under this account."
      }, null, 4));
    }
  } else {
    return res.status(404).send(JSON.stringify({
      message: "No book found matching the specified ISBN."
    }, null, 4));
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;