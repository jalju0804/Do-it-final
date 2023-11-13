import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            const error = { error: "Please provide username and password" };
            console.log(JSON.stringify(error));
            return res.status(400).json(error);
        }

        const user = await User.findOne({
            username: username,
            password: password,
        });

        if (!user) {
            const error = { error: "Invalid username or password" };
            console.log(JSON.stringify(error));
            return res.status(401).json(error);
        }

        const id = new Date().getDate();
        const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie('token', token, {
            httpOnly: true,
            expiresIn: "1d",
        });

        res.status(200).json({ msg: "Login successful", token });
    } catch (error) {
        const errorJson = {
            error: { message: error.message, stack: error.stack },
        };
        console.log("Login error:", JSON.stringify(errorJson, null, 2));
        res.status(error.statusCode || 500).json(errorJson);
    }
};

const dashboard = async (req, res) => {
    const luckyNumber = Math.floor(Math.random() * 100);

    res.status(200).json({
        msg: `Hello, ${req.user.username}`,
        secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
    });
};

export { login, dashboard };
