const express = require("express");
let books = require("./booksdb.js");
const {
  use,
} = require("../../../nodejs_PracticeProject_AuthUserMgmt/router/friends.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (isValid(username)) {
    return res
      .status(200)
      .send(JSON.stringify({ message: "The same name exists." }));
  } else if (username.length < 0 || password.length < 0) {
    return res
      .status(403)
      .send(JSON.stringify({ message: "All fields is required." }));
  } else {
    users.push({ name: username, password: password });
    return res.status(200).send(`${username} is registered.`);
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http:localhost:5000/booksdb.json");
    const data = response.data;
    return res.send(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get("http:localhost:5000/booksdb.json");
    const books = response.data;
    const book = books[isbn];
    return res.status(200).send(JSON.stringify(book));
  } catch (error) {
    res.status(200).send(JSON.stringify({ message: "Book not found." }));
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get("http:localhost:5000/booksdb.json");
    const data = response.data;
    const authorBooks = [];
    for (const book in data) {
      if (data[book].author === author) {
        authorBooks.push(data[parseInt(book)]);
      }
    }

    if (authorBooks) {
      return res.status(200).send(JSON.stringify(authorBooks));
    }
  } catch (error) {
    return res
      .status(200)
      .send(JSON.stringify({ message: "Book not founnd." }));
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get("http:localhost:5000/booksdb.json");
    const data = response.data;
    const searchBook = [];

    for (const isbn in data) {
      if (data[isbn].title === title) {
        searchBook.push(data[isbn]);
      }
    }

    if (searchBook) {
      return res.status(200).send(JSON.stringify(searchBook));
    }
  } catch (error) {
    return res.status(200).send(JSON.stringify({ message: "Not founnd." }));
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;
  if (review) {
    return res.status(201).send(JSON.stringify(review));
  }
  return res.status(200).send(JSON.stringify({ message: "Not founnd." }));
});

module.exports.general = public_users;
