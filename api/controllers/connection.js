const Connection = require("../Models/connection");

// Create a connection
exports.createConnection = async (req, res) => {
  try {
    const { userId } = req.params; // The user to connect to
    const requesterId = req.auth._id; // The user making the request

    // Prevent connecting to oneself
    if (requesterId === userId) {
      return res.status(400).json({ error: "You cannot connect to yourself." });
    }

    // Check if the connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { user1: requesterId, user2: userId },
        { user1: userId, user2: requesterId },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ error: "Connection already exists." });
    }

    // Create a new connection
    const connection = new Connection({
      user1: requesterId,
      user2: userId,
    });

    await connection.save();
    res.status(200).json({ message: "Connection created successfully.", connection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while creating the connection." });
  }
};

// Get all connections for a user
exports.getConnections = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch all connections where the user is either user1 or user2
      const connections = await Connection.find({
        $or: [{ user1: userId }, { user2: userId }],
      }).populate("user1 user2", "_id name email");
  
      res.status(200).json(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  };