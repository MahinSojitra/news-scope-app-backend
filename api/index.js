const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allowed frontend origin
const allowedOrigin = "https://news-scope-app.vercel.app";

// ✅ CORS setup — only allow the official frontend
app.use(
  cors({
    origin: allowedOrigin,
  })
);

// ✅ Middleware to block requests not from allowed origin
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Reject if the origin is not allowed
  if (!origin || origin !== allowedOrigin) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Invalid or missing origin header.",
    });
  }

  // Optional: Block if referer doesn't start with allowed origin
  if (referer && !referer.startsWith(allowedOrigin)) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Invalid referer header.",
    });
  }

  next();
});

// ✅ NewsAPI Base URL
const NEWS_API_BASE = "https://newsapi.org/v2";

// ✅ /api/news/everything - Search articles by keyword
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

// ✅ /api/news/top-headlines - Fetch US top headlines
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

// ✅ /api/news/top-headlines/sources - Fetch sources by category, language, and country
app.get("/api/news/top-headlines/sources", async (req, res) => {
  try {
    const { category, language, country } = req.query;

    const response = await axios.get(`${NEWS_API_BASE}/top-headlines/sources`, {
      params: { category, language, country },
      headers: { "X-Api-Key": process.env.NEWS_API_KEY },
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching news sources",
      error: err.message,
    });
  }
});

// ✅ Export for Vercel deployment
module.exports = app;
