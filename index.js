import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

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
const SECRET_KEY = process.env.SECRET_KEY;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
connect_db();

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();

    const token = req.cookies.authToken;
    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (decoded) {
        res.render("admin_index.ejs");
      }
    }

    res.render("index.ejs", { posts });
  } catch (error) {
    console.log(`error in fetching the posts: ${error}`);
    res.status(505).send("unable to fetch the posts");
  }
});

app.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (admin && admin.password === password) {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "24h" });

      res.cookie("authToken", token, { httpOnly: true, maxAge: 3600000 });
      res.render("write_post.ejs");
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).send(`Error when verifying credentials: ${error}.`);
  }
});

app.post("/new-post", async (req, res) => {
  const { title, body, lccn } = req.body;

  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(403).send("you gotta sign in first.");
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
      return res.status(401).send("invalid token.");
    }

    const new_post = new Post({ title, body, lccn });
    await new_post.save();

    res.redirect("/");
  } catch (error) {
    res.status(500).send(`failed because: ${error}.`);
  }
});

app.get("/admin-sign-in", (req, res) => {
  res.render("admin-sign-in.ejs");
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
