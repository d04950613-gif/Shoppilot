const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Simple JSON file database
const DB_FILE = path.join(__dirname, "data.json");

function loadData() {
  if (!fs.existsSync(DB_FILE)) return { products: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// GET all products
app.get("/api/products", (req, res) => {
  res.json(loadData().products);
});

// POST add product (with server-side validation)
app.post("/api/products", (req, res) => {
  const { name, price, stock } = req.body;

// Validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Product name required" });
  }
  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ error: "Valid price required" });
  }
  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({ error: "Valid stock required" });
  }

const data = loadData();
  const newProduct = {
    id: Date.now(),
    name: name.trim().slice(0, 100), // input sanitization
    price,
    stock,
  };
  data.products.push(newProduct);
  saveData(data);
  res.status(201).json(newProduct);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ShopPilot backend running on port ${PORT}`));
         
