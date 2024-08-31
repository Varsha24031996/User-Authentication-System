import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../utils/catchAsync";
import { authService, tokenService } from "../services";

/**
 * Handles user registration by validating input, registering the user, and generating an authentication token.
 * @param {Request} req - The Express request object. This object contains the user's registration details in the request body.
 * @param {Response} res - The Express response object. This object is used to send the HTTP response back to the client.
 * @returns {Promise<void>} - Returns a promise that resolves to void. Sends a response with a status code of 201 (Created) if registration is successful.
 * @throws {ApiError} - Throws an error if registration or token generation fails. Error handling is managed by the `catchAsync` utility.
 */
const register = catchAsync(async (req: Request, res: Response) => {
  const { fullName, username, password } = req.body;

  const result = await authService.registerUser({
    fullName,
    username,
    password,
  });

  const token = await tokenService.generateAuthToken(result);

  return res.status(httpStatus.CREATED).send({
    message: "User registered successfully",
    data: result,
    tokenDetails: token,
  });
});

/**
 * Handles user login by validating input and authenticating the user.
 * @param {Request} req - The Express request object. This object contains the user's login details in the request body.
 * @param {Response} res - The Express response object. This object is used to send the HTTP response back to the client.
 * @returns {Promise<void>} - Returns a promise that resolves to void. Sends a response with a status code of 200 (OK) if login is successful.
 * @throws {ApiError} - Throws an error if authentication fails. Error handling is managed by the `catchAsync` utility.
 */
const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const result = await authService.loginUser({
    username,
    password,
    tokenId: req?.user?.sub,
  });

  return res.status(httpStatus.OK).send({
    message: "User loggedIn successfully",
    data: result,
  });
});

/**
 * Handles user login by validating input and authenticating the user.
 * This function checks the provided username and password, and also validates the token ID for authorization.
 * @param {Request} req - The Express request object. This object contains the user's login details (username and password) in the request body and the user’s token ID in the request context.
 * @param {Response} res - The Express response object. This object is used to send the HTTP response back to the client.
 * @returns {Promise<void>} - Returns a promise that resolves to void. Sends a response with a status code of 200 (OK) if login is successful.
 * @throws {ApiError} - Throws an error if authentication fails. Error handling is managed by the `catchAsync` utility.
 */
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { username, newPassword } = req.body;
  const resetKey: string | string[] | undefined = req.headers["x-api-key"];

  const result = await authService.resetUserPass(
    username,
    newPassword,
    resetKey
  );

  return res
    .status(httpStatus.OK)
    .send({ message: "Password resetted successfully" });
});

export { register, login, resetPassword };
