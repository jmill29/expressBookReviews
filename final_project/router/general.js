const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {  /* If username isn't already taken, then register the user
                                   with the given username and push the user data to the
                                   list of users */
      users.push({username, password});
      return res.status(200).send(JSON.stringify({
        message: "User successfully registered. You may now login."
      }, null, 4));
    } else {
      return res.status(400).send(JSON.stringify({ /* If username already taken, send a 
                                                        message indicating so */
        message: "User already exists. Please choose a different username."
      }, null, 4));
    }
  }
  return res.status(400).send(JSON.stringify({ /* If no username/password is indicated, send 
                                                    a message to user requesting him/her to 
                                                    include one */
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
    if (bookToSend) {                           /* If the specified isbn matches a book in 
                                                     inventory, return it to the user */
      res.status(200).send(JSON.stringify(books[req.params.isbn], null, 4));
    } else {                                    /* If no book matches the specified isbn,
                                                     send back a 404 response and a message
                                                     to the user indicating so */
      res.status(404).send(JSON.stringify({
        message: "Book not found."
      }, null, 4));
    }
  } else {  /* If no isbn is specified, send a 400 response and a message to the user
                 indicating the issue */
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
  for (let book in books) { /*
                              Iterate through 'books' dictionary and check if the title
                                of each includes the title specified in the request 
                                parameter
                            */
    if (books[book].title.includes(title)) {
      booksWithTitle[book] = books[book];
    }
  }
  if (Object.keys(booksWithTitle).length > 0) {  /* If any books match the specified title,
                                                     return it in JSON */
    res.status(200).send(JSON.stringify(booksWithTitle, null, 4));
  } else {
    res.status(404).send(JSON.stringify({  /* If no books match the requested title,
                                                then return a message indicating so */
      message: "No books found."
    }, null, 4));
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    if (books[isbn]) {
      if (Object.keys(books[isbn].reviews).length > 0) { /* If there are user reviews for the
                                                              requested book, send them to the
                                                              user */
        res.status(200).send()
      } else {                                /* If there are no user reviews for the requested
                                                   book, send a 404 response and a message to the 
                                                   user indicating the issue */
        res.status(404).send(JSON.stringify({
          message: "No book reviews found."
        }, null, 4));
      }
    } else { /* If there are no books that match the specified isbn, then send a 404 response
                  and a message to the user indicating the issue */
      res.status(404).send(JSON.stringify({
        message: "Book not found. Please enter a valid ISBN."
      }, null, 4));
    }
  } else {  /* If no isbn is specified, send a 400 response and a message to the user
                 indicating the issue */
    res.status(400).send(JSON.stringify({
      message: "Please include an ISBN in your search request."
    }, null, 4));
  }
});

/************************************** API CALLS **************************************/

const axios = require("axios");

// Retrieve all books stored in the database
const getAllBooks = async () => {
  const url = "http://localhost:5000/";

  try {
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.log(error.response.data);
  }
}

// Retrieve specific book by it's ISBN number
const getBookByISBN = async (isbn) => {
  const url = "http://localhost:5000/isbn/" + isbn;

  try {
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
};

// Get all the books written by a specific author
const getBooksByAuthor = async (author) => {
  const url = "http://localhost:5000/author/" + author;

  try {
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
};

// Retrieve all the books with a specific title
const getBookByTitle = async (title) => {
  const url = "http://localhost:5000/title/" +  title;

  axios.get(url)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error.response.data);
    })
};

/************************************** API CALLS **************************************/

module.exports.general = public_users;