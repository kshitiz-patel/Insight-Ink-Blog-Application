import express from "express";
import _ from "lodash";
import mongoose, { Schema } from "mongoose";
import { marked } from "marked";

const app = express();
const port = 3300;

// Get the current date
const currentDate = new Date();

// Define an array for month names
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Extract day, month, and year from the current date
const day = currentDate.getDate();
const month = monthNames[currentDate.getMonth()];
const year = currentDate.getFullYear();

// Format the date string
const formattedDate = `${month} ${day} ${year}`;

const contentDB = {
  homeContent: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. </h1>`,
  aboutContent: "Hee",
  contactContent: "jee",
};

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://127.0.0.1:27017/postDB", { useNewUrlParser: true });

const d = new Date();

const postSchema = new Schema({
  postTitle: String,
  postDescription: String,
  postBody: String,
  postDate: String,
  postReadDuration: Number,
  postAuthor: String,
  postCategory: String,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", async function (req, res) {
  const postgh = await Post.find({}).exec();
  res.render("index.ejs", {
    content: contentDB.homeContent,
    postDB: postgh,
    length: 200,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose.ejs");
});

app.get("/contactus", function (req, res) {
  res.render("index.ejs", { content: contentDB.contactContent });
});

app.get("/aboutus", function (req, res) {
  res.render("index.ejs", { content: contentDB.aboutContent });
});

app.get("/post/:topic", async function (req, res) {
  const findparams = req.params.topic;
  // console.log(findparams);
  const postObject = await Post.findOne({ postTitle: findparams }).exec();
  res.render("post.ejs", {
    postTitle: postObject.postTitle,
    postBody: postObject.postBody,
    postDate: postObject.postDate,
    postReadDuration: postObject.postReadDuration,
    params: req.params.topic,
  });
});

app.post("/compose", function (req, res) {
  const blogContent = req.body.postBody;
  function calculateReadTime(content, wordsPerMinute = 200) {
    const wordCount = content.split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return readTimeMinutes;
  }

  const readTime = calculateReadTime(blogContent);

  const post = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
    postDate: formattedDate,
    postReadDuration: readTime,
  });
  post.save();
  res.redirect("/");
});

app.listen(port, function () {
  console.log(`server is running on port ${port}.`);
});

