// middleware/authMiddleware.js
const checkAdminPermission = (req, res, next) => {
    const userRole = req.user.role;

    if (userRole === 'admin') {
        next(); // Cho phép tiếp tục nếu là admin
    } else {
        return res.status(403).send({ success: false, msg: "Permission denied. Only admin can delete songs." });
    }
};

module.exports = { checkAdminPermission };
