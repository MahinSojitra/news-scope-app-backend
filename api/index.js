const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allowed frontend origin
const allowedOrigin = "https://news-scope-app.vercel.app";

// ✅ Strict CORS middleware — allows only the official frontend
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

// ✅ Manual origin + referer check to protect non-browser clients (like Postman/cURL)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  const isAllowed =
    (!origin || origin === allowedOrigin) &&
    (!referer || referer.startsWith(allowedOrigin));

  if (isAllowed) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message:
        "Access denied: Only requests from the official frontend are permitted.",
    });
  }
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

// ✅ Export for Vercel deployment
module.exports = app;
