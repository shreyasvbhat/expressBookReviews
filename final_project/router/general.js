const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    }else{
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!doesExist(username)){
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    }else{
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Using Promise callbacks to fetch the list of books
function getBooks() {
    return new Promise((resolve, reject) => {
        axios.get('https://udupishreyas-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/')
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}
  
  // Route handler for getting the list of books
  public_users.get('/', async function (req, res) {
    getBooks()
    .then(books => {
        console.log("List of books:", books);
    })
    .catch(error => {
        console.error("Error fetching books:", error);
    });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = [];
  const isbns = Object.keys(books);
  isbns.forEach(isbn => {
    const book = books[isbn];
    if(book.author === author){
        matchingBooks.push(book);
    }
  });
  res.send(matchingBooks);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingTitle = [];
  const isbns = Object.keys(books);
  isbns.forEach(isbn => {
    const book = books[isbn];
    if(book.title === title){
        matchingTitle.push(book);
    }
  });
  res.send(matchingTitle);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books.hasOwnProperty(isbn)){
    const reviews = books[isbn].reviews;
    res.send(reviews);
  }else{
    res.send(404).json({message: "Book not found"});
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
