const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:4200",
  "https://news-scope-app.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const NEWS_API_BASE = "https://newsapi.org/v2";

app.get("/api/news/everything", async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: { q, language: "en" },
      headers: { "X-Api-Key": process.env.NEWS_API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching articles", error: err.message });
  }
});

app.get("/api/news/top-headlines", async (req, res) => {
  try {
    const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
      params: { country: "us", language: "en" },
      headers: { "X-Api-Key": process.env.NEWS_API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching headlines", error: err.message });
  }
});

// ✅ Export handler for Vercel
module.exports = app;
