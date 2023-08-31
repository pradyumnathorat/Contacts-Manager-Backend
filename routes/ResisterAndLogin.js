const express = require('express');
const userModel = require('../models/user/userModel')
const { body, validationResult } = require('express-validator');
const router = express.Router();
router.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const recaptchaSecretKey = "6LeQdecnAAAAAIpILvCmCd9zGKy6OzXfNHFd0hsK";
const request = require("request");


const secret = "RESTAPI";
router.post("/register", async (req, res) => {

        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (user) {
                return res.status(403).json({ error: "User already exists" })
            }
            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    })
                }
                const data = await userModel.create({
                    email,
                    password: hash
                })
                return res.status(200).json({
                    message: "SignUp Successfully"
                })
            })
        } catch (err) {
            return res.status(400).json({
                status: "Failed",
                message: err.message
            })
        }

    })


router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        const recaptchaResponse = req.headers["captcha-response"]
        const verifyRecaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaResponse}`;

        request(verifyRecaptchaUrl, async (error, response, body) => {
            if (error) {
                return res.status(500).json({
                    error: error.message
                });
            }

            const data = JSON.parse(body);
            if (!data.success) {
                return res.status(403).json({
                    error: "reCAPTCHA verification failed"
                });
            }

            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(403).json({
                    error: "Unknown User"
                });
            }

            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
                        data: user._id
                    }, secret);
                    return res.status(200).json({
                        message: "Login successful",
                        token: token,
                        user: user.email
                    });
                } else {
                    return res.status(400).json({
                        error: "Invalid Password"
                    });
                }
            });
        });
    } catch (err) {
        return res.status(400).json({
            status: "Failed",
            message: err.message
        });
    }
});


module.exports = router;