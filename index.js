const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Get user from database or create if doesn't exist
    let user = await usersCollection.findOne({ email: decodedToken.email });
    
    if (!user) {
      // Create new user with Firebase auth data
      user = {
        email: decodedToken.email,
        displayName: decodedToken.name || decodedToken.displayName || "Anonymous",
        photoURL: decodedToken.picture || decodedToken.photoURL || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          notifications: true,
          emailUpdates: true
        }
      };
      await usersCollection.insertOne(user);
    }

    // Always update Firebase auth data if available
    const updateData = {};
    if (decodedToken.name || decodedToken.displayName) {
      updateData.displayName = decodedToken.name || decodedToken.displayName;
    }
    if (decodedToken.picture || decodedToken.photoURL) {
      updateData.photoURL = decodedToken.picture || decodedToken.photoURL;
    }
    
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
      await usersCollection.updateOne(
        { email: decodedToken.email },
        { $set: updateData }
      );
      // Get updated user data
      user = await usersCollection.findOne({ email: decodedToken.email });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// User Management Endpoints
app.post("/users", authenticate, async (req, res) => {
  console.log("=== POST /users ===");
  console.log("User:", req.user);
  console.log("Request body:", req.body);
  
  try {
    const { displayName, photoURL, preferences } = req.body;

    const updateData = {
      displayName: displayName || req.user.displayName,
      photoURL: photoURL || req.user.photoURL,
      preferences: preferences || req.user.preferences || {
        notifications: true,
        emailUpdates: true
      },
      updatedAt: new Date()
    };

    console.log("Updating user with data:", updateData);

    const result = await usersCollection.updateOne(
      { email: req.user.email },
      { $set: updateData }
    );

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      // User doesn't exist, create new user
      const newUser = {
        email: req.user.email,
        ...updateData,
        createdAt: new Date()
      };
      await usersCollection.insertOne(newUser);
      res.status(201).json(newUser);
    } else {
      // Get and return updated user
      const updatedUser = await usersCollection.findOne({ email: req.user.email });
      res.json(updatedUser);
    }
  } catch (error) {
    console.error("Create/Update User Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/users/:email", authenticate, async (req, res) => {
  console.log("=== GET /users/:email ===");
  console.log("User Email:", req.params.email);
  try {
    const user = await usersCollection.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Found user:", user);
    res.json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/users/:email", authenticate, async (req, res) => {
  console.log("=== PUT /users/:email ===");
  console.log("User Email:", req.params.email);
  console.log("Update Data:", req.body);
  try {
    // Verify user is updating their own profile
    if (req.params.email !== req.user.email) {
      return res.status(403).json({
        error: "Unauthorized - Cannot update other user's profile",
      });
    }

    const { displayName, phoneNumber, bio, preferences, photoURL } = req.body;

    const updateData = {
      displayName: displayName || req.user.displayName,
      phoneNumber: phoneNumber || req.user.phoneNumber,
      bio: bio || req.user.bio,
      photoURL: photoURL || req.user.photoURL,
      preferences: preferences || req.user.preferences || {
        notifications: true,
        emailUpdates: true,
      },
      updatedAt: new Date(),
    };

    console.log("Update data:", updateData);

    const result = await usersCollection.updateOne(
      { email: req.params.email },
      { $set: updateData }
    );

    console.log("Update result:", result);

    if (result.modifiedCount > 0 || result.matchedCount > 0) {
      const updatedUser = await usersCollection.findOne({
        email: req.params.email,
      });
      console.log("Updated user:", updatedUser);
      res.json(updatedUser);
    } else {
      console.log("Update failed - no modifications");
      res.status(400).json({ error: "Failed to update user profile" });
    }
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}); 