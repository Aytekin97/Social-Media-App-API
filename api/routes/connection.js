const express = require("express");
const router = express.Router();
const { requiresignin } = require("../controllers/Auth");
const { createConnection } = require("../controllers/connection");

// Create a new connection
router.post("/connection/:userId", requiresignin, createConnection);
// Get all connections for a user
router.get("/connections/:userId", requiresignin, getConnections);

module.exports = router;
