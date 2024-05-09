import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./server/models/post.js";

dotenv.config();

const connect_db = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`database connected: ${conn.connection.host}`);
    try {
      populate_database();
      console.log("database populated.");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const populate_database = async () => {
  try {
    const ex_post = new Post({
      title: "foundation by isaac asimov",
      body: "Foundation by Isaac Asimov is a classic sci-fi series that's still fascinating. The way Asimov imagines this complex, far-future galaxy, all while playing with ideas about politics, psychology, and fate, is pretty mind-blowing. Sure, the characters can be a bit archetypal at times, but the sweeping plot makes up for it. It's got the whole 'rise-and-fall of civilizations' vibe that’s both epic and eerily familiar. Definitely worth a read if you dig big ideas and love exploring new worlds!",
      lccn: 2003069137,
    });
    const ex_post_2 = new Post({
      title: "oliver twist by charles dickens",
      body: "Oliver Twist by Charles Dickens is a wild ride through the grimy streets of Victorian London. Dickens nails it with his sharp critique of society while weaving in some dark humor that keeps things engaging. Oliver, the plucky young protagonist, is surrounded by memorable characters like the creepy Fagin and the charismatic but terrifying Bill Sikes. Sure, it gets a bit melodramatic, but the story’s heart and Dickens’ vivid storytelling totally shine through. If you're into tales of resilience and quirky characters, this one’s a solid pick!",
      lccn: 92052899,
    });
    const ex_post_3 = new Post({
      title: "chess story by steven zweig",
      body: "Chess Story by Stefan Zweig is a gripping little novella that packs a punch way above its weight class. It’s all about a chess match on a cruise ship, but it's so much more than that. Zweig dives deep into the psychology of the players, especially Dr. B, whose past is as twisted as it is fascinating. The tension is real, and the storytelling? Absolutely top-notch. If you’re looking for a quick read that makes you think and keeps you on the edge of your seat, this one's a gem!",
      lccn: 2005012029,
    });
    const ex_post_4 = new Post({
      title: "pride and prejudice by jane austen",
      body: "Pride and Prejudice by Jane Austen is a timeless gem, for sure. The witty banter between Elizabeth Bennet and Mr. Darcy is legendary, and Austen's clever social critique makes the whole thing feel super fresh, even now. The drama around class, love, and family is so well done that it's hard not to get hooked. Plus, the whole enemies-to-lovers vibe between Lizzy and Darcy is just *chef's kiss*. If you’re into sharp dialogue and juicy romance with a side of satire, it’s a must-read!",
      lccn: 65023038,
    });

    await ex_post.save();
    await ex_post_2.save();
    await ex_post_3.save();
    await ex_post_4.save();
  } catch (error) {
    console.log(`Exit with error: ${error}.`);
  }
};

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.static("public"));
connect_db();

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
