const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configuration for production + localhost
const allowedOrigins = [
  "http://localhost:4200", // Angular local dev
  "https://news-scope-app.vercel.app", // Deployed frontend
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

// 🔍 Search Articles Endpoint
app.get("/api/news/search", async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: {
        q,
        language: "en",
      },
      headers: {
        "X-Api-Key": process.env.NEWS_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching articles", error: err.message });
  }
});

// 📰 Top Headlines Endpoint
app.get("/api/news/top-headlines", async (req, res) => {
  try {
    const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
      params: {
        country: "us",
        language: "en",
      },
      headers: {
        "X-Api-Key": process.env.NEWS_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching headlines", error: err.message });
  }
});

module.exports = app;
