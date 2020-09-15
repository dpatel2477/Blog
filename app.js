//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://admin-dhruv:admin@cluster0.y2prv.mongodb.net/blogDB", {useNewUrlParser: true,useUnifiedTopology: true});

const postSchema={
  title:String,
  body:String
};
const Post= mongoose.model("Post",postSchema);

const homeStartingContent = "Welcome to your daily blogging journal! You can use this service for free without any subscription needed. Click the compose button to get your blog started.";
const aboutContent = "This web application was developed with JavaScript, EJS, Node.js, Express.js, MongoDB, Mongoose, HTML, CSS.";
const contactContent = "If any bugs come up, please email me: dpatel247@yahoo.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Post.find({},function(err,results){
    res.render("home", {
      homeIntro: homeStartingContent,
      posts:results
    });
  })


});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutIntro: aboutContent
  });
});
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactIntro: contactContent
  });
});
app.get("/compose", function(req, res) {
  res.render("compose");
});
app.get("/posts/:title", function(req,res){
  Post.findById(req.params.title, function(err, post){
    res.render("post",{
      title:post.title,
      content:post.body,
    });
  })
});
app.get("/delete/:title", function(req,res){
  Post.deleteOne({"_id": (req.params.title)}, function(err, post){
    res.redirect("/");
  })
});

app.post("/compose", function(req, res) {
  let title = req.body.postTitle;
  let text = req.body.postText;
  const post= new Post({
    title:title,
    body:text
  });
  post.save(function(err){
    if(!err){
        res.redirect("/");
    }
  });


})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
