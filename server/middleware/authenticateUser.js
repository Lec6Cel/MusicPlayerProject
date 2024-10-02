// middleware/authenticate.js
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin người dùng vào req.user
        next();
    } catch (error) {
        return res.status(401).send({ success: false, msg: "Authentication failed." });
    }
};

module.exports = authenticateUser;
