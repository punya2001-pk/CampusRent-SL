const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data store for boarding places
let boardings = [
  {
    id: 1,
    title: "Luxury Annex Room for Boys",
    location: "Pambaimadu, Vavuniya",
    distance: "500m to Campus",
    price: 8500,
    type: "Single",
    gender: "Boys",
    phone: "94716957954",
    features: ["Attached Bathroom", "Free Wi-Fi", "Quiet Study Area"],
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Spacious House for Girls (Shared)",
    location: "Kurusukulam, Vavuniya",
    distance: "1.2km to Campus",
    price: 6500,
    type: "Shared",
    gender: "Girls",
    phone: "94776727201",
    features: ["Kitchen Access", "Water Filter", "Gated Security"],
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"
  }
];

// GET: Retrieve all boarding listings
app.get('/api/boardings', (req, res) => {
  res.json(boardings);
});

// POST: Add a new boarding listing (Landlord functionality)
app.post('/api/boardings', (req, res) => {
  const newListing = {
    id: Date.now(),
    ...req.body,
    price: Number(req.body.price),
    features: Array.isArray(req.body.features) ? req.body.features : [req.body.features]
  };
  boardings.unshift(newListing);
  res.status(201).json(newListing);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});