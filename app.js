import express from "express";

import tasks from "./routes/tasks.js";
import jwtRouter from "./routes/jwt.js";

import connectDB from "./db/connect.js";

import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import { swaggerUi, specs } from "./swagger.js";

import authenticationMiddleware from "./middleware/auth.js";

import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();

// middleware
app.use(express.static("./public"));
// page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/board", authenticationMiddleware, (req, res) => {
    res.sendFile(__dirname + "/public/index-board.html");
});

app.use(express.json());
app.use(
    "/api-docs",
    authenticationMiddleware,
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

// routes
app.use("/api/v1/tasks", tasks);
app.use("/api/v1", jwtRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);

        const initialUsers = [
            {
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            },
        ];
        console.log(initialUsers);

        const insertInitialData = async () => {
            try {
                await User.insertMany(initialUsers);

                console.log("초기 데이터 삽입이 완료되었습니다.");
            } catch (error) {
                console.error("초기 데이터 삽입 중 오류 발생:", error);
            }
        };

        await insertInitialData();

        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
