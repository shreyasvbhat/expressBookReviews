const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    }else{
        return false;
    }
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username  && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    }else{
        return false;
    }
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access', {});
    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  }else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  if(books.hasOwnProperty(isbn)){

    if(books[isbn].reviews.hasOwnProperty(username)){

        books[isbn].reviews[username] = review;
        res.send("Review modified successfully");
    }else{
        books[isbn].reviews[username] = review;
        res.send("Review added successfully");
    }
  }else{
    res.status(404).json({message: "Book not found"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req,res)=>{
   const isbn = req.params.isbn;
   const username = req.session.username;
   
   if(books.hasOwnProperty(isbn)){
    if(books[isbn].reviews.hasOwnProperty(username)){
        delete books[isbn].reviews[username];
        res.send("Review deleted successfully");
    }else{
        res.status(404).json({message: "Review not found"});
    }
   }else{
    res.status(404).json({message: "Book not found"});
   }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
