import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "node:path";
const __dirname = import.meta.dirname;

dotenv.config();
const router = express.Router();
router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});
router.post("/register", async (req, res) => {
  // console.log(req.body)
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email: email } });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { id: user.id, username: user.username, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
    });
    return res.redirect("/");
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
router.get("/secure", (req, res) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    console.log(user);
    return res.sendFile(path.join(__dirname, "../public/secure.html"));
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/");
  }
});
router.get("/admin", (req, res) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    if (user.role === "admin") {
      return res.sendFile(path.join(__dirname, "../public/admin.html"));
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/");
  }
});



export default router;
