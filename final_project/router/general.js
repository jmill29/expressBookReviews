const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({username, password});
      return res.status(200).send(JSON.stringify({
        message: "User successfully registered. You may now login."
      }, null, 4));
    } else {
      return res.status(400).send(JSON.stringify({
        message: "User already exists. Please choose a different username."
      }, null, 4));
    }
  }
  return res.status(400).send(JSON.stringify({
    message: "Unable to register user. Please make sure to include both a username and password."
  }, null, 4));
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  if (req.params.isbn) {
    const bookToSend = books[req.params.isbn];
    if (bookToSend) {
      res.status(200).send(JSON.stringify(books[req.params.isbn], null, 4));
    } else {
      res.status(404).send(JSON.stringify({
        message: "Book not found."
      }, null, 4));
    }
  } else {
    res.status(400).send(JSON.stringify({
      message: "Please specify the isbn of the book you'd like to get"
    }, null, 4));
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = {};
  for (let book in books) { // Use 'bookId' instead of 'book'
    if (books[book].author === author) {
      booksByAuthor[book] = books[book]; // Use 'bookId' as key
    }
  }
  if (Object.keys(booksByAuthor).length > 0) { // Check if booksByAuthor is not empty
    res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    res.status(404).send(JSON.stringify({
      message: "No books found."
    }, null, 4));
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksWithTitle = {};
  for (let book in books) {
    if (books[book].title.includes(title)) {
      booksWithTitle[book] = books[book];
    }
  }
  if (Object.keys(booksWithTitle).length > 0) {
    res.status(200).send(JSON.stringify(booksWithTitle, null, 4));
  } else {
    res.status(404).send(JSON.stringify({
      message: "No books found."
    }, null, 4));
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    if (books[isbn]) {
      if (Object.keys(books[isbn].reviews).length > 0) {
        res.status(200).send()
      } else {
        res.status(404).send(JSON.stringify({
          message: "No book reviews found."
        }, null, 4));
      }
    } else {
      res.status(404).send(JSON.stringify({
        message: "Book not found. Please enter a valid ISBN."
      }, null, 4));
    }
  } else {
    res.status(400).send(JSON.stringify({
      message: "Please include an ISBN in your search request."
    }, null, 4));
  }
});

module.exports.general = public_users;
