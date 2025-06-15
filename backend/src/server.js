import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve full frontend folder
app.use(express.static(path.join(__dirname, "../../frontend")));

// In-memory URL store
const urlDatabase = {}; // key = code, value = longURL

function generateShortCode() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /shorten
app.post("/shorten", (req, res) => {
  const { longURL } = req.body;
  if (!longURL || typeof longURL !== "string") {
    return res.status(400).json({ error: "Valid longURL is required." });
  }

  const code = generateShortCode();
  urlDatabase[code] = longURL;

  const shortURL = `${req.protocol}://${req.get("host")}/${code}`;
  res.json({ shortURL });
});

// Redirect by code
app.get("/:code", (req, res) => {
  const code = req.params.code;
  const longURL = urlDatabase[code];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("❌ Short URL not found.");
  }
});

// Serve frontend (for non-API routes)
app.get("/{*catchall}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 LinkXpress server running on http://localhost:${PORT}`);
});
