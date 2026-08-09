const express = require('express');
const router = express.Router();

const categories = [
  { id: 1, name: "Stationery" },
  { id: 2, name: "Grocery" },
  { id: 3, name: "Vegetables" },
  { id: 4, name: "Drinks" },
  { id: 5, name: "Snacks" },
  { id: 6, name: "Fruits" },
  { id: 7, name: "Dairy Products" },
  { id: 8, name: "Bakery" },
  { id: 9, name: "Personal Care" },
  { id: 10, name: "Household Items" }
];

const productData = {
  "Stationery": ["Notebook", "Pen", "Pencil", "Eraser", "Sharpener", "Highlighter", "Marker", "Sticky Notes"],
  "Grocery": ["Rice", "Wheat Flour", "Sugar", "Salt", "Cooking Oil", "Toor Dal", "Chili Powder", "Turmeric Powder"],
  "Vegetables": ["Tomato", "Potato", "Onion", "Carrot", "Beans", "Cabbage", "Cauliflower", "Brinjal"],
  "Drinks": ["Mineral Water", "Orange Juice", "Mango Juice", "Apple Juice", "Soft Drink", "Energy Drink", "Tea", "Coffee"],
  "Snacks": ["Potato Chips", "Biscuits", "Popcorn", "Chocolate", "Cookies", "Namkeen", "Peanuts", "Cake"],
  "Fruits": ["Apple", "Banana", "Orange", "Grapes", "Mango", "Papaya", "Pomegranate", "Watermelon"],
  "Dairy Products": ["Milk", "Curd", "Butter", "Cheese", "Paneer", "Ghee", "Ice Cream", "Yogurt"],
  "Bakery": ["Bread", "Bun", "Croissant", "Muffin", "Donut", "Puff", "Pastry", "Garlic Bread"],
  "Personal Care": ["Shampoo", "Soap", "Face Wash", "Toothpaste", "Toothbrush", "Body Lotion", "Hair Oil", "Deodorant"],
  "Household Items": ["Detergent Powder", "Dishwash Liquid", "Floor Cleaner", "Toilet Cleaner", "Mop", "Bucket", "Trash Bags", "Tissue Paper"]
};

// Generate products with random prices
let nextId = 1;
const products = [];
for (const [category_name, items] of Object.entries(productData)) {
  for (const name of items) {
    const price = (Math.random() * 49 + 1).toFixed(2); // Random price between 1.00 and 50.00
    products.push({
      id: nextId++,
      category_name,
      name,
      price
    });
  }
}

// Get all categories
router.get('/categories', (req, res) => {
  res.json({ success: true, data: categories });
});

// Get all products
router.get('/', (req, res) => {
  res.json({ success: true, data: products });
});

module.exports = router;
