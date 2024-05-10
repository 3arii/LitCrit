import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./server/models/post.js";
import Admin from "./server/models/admin.js";

dotenv.config();

const connect_db = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`database connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
connect_db();

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();

    res.render("index.ejs", { posts });
  } catch (error) {
    console.log(`error in fetching the posts: ${error}`);
    res.status(505).send("unable to fetch the posts");
  }
});

app.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(username);
    const admin = await Admin.findOne({ username });
    console.log(admin);

    if (admin && admin.password === password) {
      res.send("logged in");
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).send(`Error when verifying credentials: ${error}.`);
  }
});

app.get("/admin-sign-in", (req, res) => {
  res.render("admin-sign-in.ejs");
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
