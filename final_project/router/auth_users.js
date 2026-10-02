const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const existingUser = users.filter(user => user.name === username);
  if(existingUser.length > 0){
    return true;
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const authUser = users.filter((user) => user.name === username && user.password === password);
  if(authUser.length > 0){
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password,
    }, 'access', {expiresIn: 60*60});
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message: "LOGGIN"});
  }
  return res.status(200).json({message: "Invalid loggin"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization["username"];

  if(review){
    books[isbn].reviews[username] =  review;
    return res.status(200).json({message: "review has been updated."})
  }
  return res.status(208).json({message: "Unable to update."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"];

  books[isbn].reviews[username] = '';
  return res.status(200).json({message: "review has been deleted."})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
