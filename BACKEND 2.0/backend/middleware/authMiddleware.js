import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token or wrong format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token ❌" });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ❌ No secret defined
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT Secret missing ❌" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Store user data in request
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Token Error:", err.message);
    return res.status(401).json({ msg: "Invalid token ❌" });
  }
};

export default verifyToken;