const UserModel = require("../models/users");
const argon2 = require("argon2");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    const newUser = await UserModel.createUser(name, email, hashedPassword);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Database error" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.getUserByEmail(email);
    if (!user || !(await argon2.verify(user.password_hash, password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database error" });
  }
};
