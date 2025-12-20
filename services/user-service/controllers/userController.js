
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone_no } = req.body;

    if (!name || !email || !password || !phone_no) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone_no
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone_no: user.phone_no
      }
    });

  } catch (err) {
    console.error("registerUser error:", err.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    console.error("loginUser error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const authUser = async (req, res) => {
   return res.status(200).json({
      "isLoggedIn": true,
      "response": req.body
      });
}

const myProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized access"
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (err) {
    console.error("myProfile error:", err.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const { name, number } = req.body;

    if (!name && !number) {
      return res.status(400).json({
        message: "Nothing to update"
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (number) updateData.phone_no = number;

    const result = await User.updateOne(
      { _id: req.user.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully"
    });

  } catch (err) {
    console.error("updateProfile error:", err.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const addAddress = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        message: "Address is required"
      });
    }

    const result = await User.updateOne(
      { _id: req.user.id },
      { $push: { address } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Address added successfully"
    });

  } catch (err) {
    console.error("addAddress error:", err.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const deleteAddress = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        message: "Address is required"
      });
    }

    const result = await User.updateOne(
      { _id: req.user.id },
      { $pull: { address } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "Address not found"
      });
    }

    return res.status(200).json({
      message: "Address deleted successfully"
    });

  } catch (err) {
    console.error("deleteAddress error:", err.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


module.exports = {registerUser, loginUser, authUser, myProfile, updateProfile, addAddress, deleteAddress};