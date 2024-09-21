const router = require("express").Router();
const user = require("../models/user");
const admin = require("../config/firebase.config");

router.get("/login", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({ message: "Invalid Token" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (!decodeValue) {
            return res.status(505).json({ message: "Unauthorized" });
        } else {
            // Kiểm tra người dùng có tồn tại hay không
            const userExists = await user.findOne({ "user_id": decodeValue.user_id });
            if (!userExists) {
                return newUserData(decodeValue, req, res);
            } else {
                return updateNewUserData(decodeValue, req, res);
            }
        }
    } catch (error) {
        return res.status(505).json({ message: error });
    }
});

const newUserData = async (decodeValue, req, res) => {
    const newUser = new user({
        name: decodeValue.name,
        email: decodeValue.email,
        imageURL: decodeValue.picture,
        user_id: decodeValue.user_id,
        email_verified: decodeValue.email_verified,
        role: "member",
        auth_time: decodeValue.auth_time
    });

    try {
        const savedUser = await newUser.save();
        return res.status(200).send({ user: savedUser });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
};

const updateNewUserData = async (decodeValue, req, res) => {
    const filter = { user_id: decodeValue.user_id };
    const options = { upsert: true, new: true };

    try {
        const result = await user.findOneAndUpdate(
            filter,
            { auth_time: decodeValue.auth_time },
            options
        );
        return res.status(200).send({ user: result });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
}; 

router.get("/getUsers", async( req, res)=> {
    const options = {
        sort : {
            // sap xep cac thong tin nghe si theo thu tu da tao truoc do
            createdAt : 1
        },
    };

    const data = await user.find({},null, options);
    if (data) {
        return  res.status(200).send({success : true, user: data})
    } else {
        return  res.status(400).send({success : false, msg : "Data not Found"})
    };
})

module.exports = router;
