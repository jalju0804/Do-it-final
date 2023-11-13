import { CustomAPIError } from "../errors/custom-error.js";
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    // return res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .send('Something went wrong try again later');

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: {
            message: "Something went wrong, try again later",
        },
    });
};

export default errorHandlerMiddleware;
