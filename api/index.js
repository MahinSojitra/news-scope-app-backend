const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allow only this origin
const allowedOrigin = "https://news-scope-app.vercel.app";

// ✅ Custom CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Origin not allowed"));
      }
    },
  })
);

// ✅ Middleware to block disallowed origins (even for non-CORS requests)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || origin === allowedOrigin) {
    return next();
  } else {
    return res.status(403).json({
      success: false,
      message:
        "Access denied: Only requests from the allowed origin are permitted.",
    });
  }
});

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
    res.status(500).json({
      message: "Error fetching articles",
      error: err.message,
    });
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
    res.status(500).json({
      message: "Error fetching headlines",
      error: err.message,
    });
  }
});

// ✅ Export for Vercel
module.exports = app;
