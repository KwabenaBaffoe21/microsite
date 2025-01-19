const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Path to the tributes storage file
const TRIBUTES_FILE = path.join(__dirname, "tributes.json");

// Middleware for serving static files and parsing JSON
app.use(express.static(path.join(__dirname, "public"))); // Serve HTML, CSS, JS
app.use(bodyParser.json()); // Parse JSON for tribute submissions

// Function to load tributes from file
const loadTributes = () => {
    if (fs.existsSync(TRIBUTES_FILE)) {
        const data = fs.readFileSync(TRIBUTES_FILE, "utf8");
        return JSON.parse(data);
    }
    return [];
};

// Function to save tributes to file
const saveTributes = (tributes) => {
    fs.writeFileSync(TRIBUTES_FILE, JSON.stringify(tributes, null, 2));
};

// Load tributes into memory
let tributes = loadTributes();

// Route to serve the brochure
app.get("/brochure.pdf", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "brochure.pdf")); // Adjust the path as necessary
});

// API to submit a tribute
app.post("/api/tributes", (req, res) => {
    const { name, text } = req.body;
    if (!name || !text) {
        return res.status(400).json({ error: "Name and text are required." });
    }
    tributes.push({ name, text });
    saveTributes(tributes); // Save the updated tributes to the file
    res.status(201).json({ message: "Tribute submitted successfully.", tributes });
});

// API to get all tributes
app.get("/api/tributes", (req, res) => {
    res.json(tributes);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
