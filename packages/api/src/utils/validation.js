import { body } from "express-validator";
import { getUserByEmail } from "./queries.js";
import { isTrue } from "./isTrue.js";

const lengthErr = (max, min = 1) => {
  return `must be between ${min} and ${max} characters`;
};

export const validateUser = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Email must be formatted properly")
    .custom(async (value) => {
      const user = await getUserByEmail(value);
      if (user) throw new Error("E-mail already in use");
    }),
  body("password")
    .trim()
    .isLength({ min: 6, max: 25 })
    .withMessage(`Password ${lengthErr(25, 6)}`),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  body("authorPasscode")
    .trim()
    .custom((value, { req }) => {
      if (!isTrue(req.body.isAuthor)) return true;
      return value === process.env.AUTHOR_PASSCODE;
    })
    .withMessage("Author passcode is incorrect"),
];

export const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Title ${lengthErr(50)}`),
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Content ${lengthErr(1000)}`),
];

export const validateComment = [
  body("comment")
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage(`Comment ${lengthErr(300)}`),
];
