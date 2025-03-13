import { customAlphabet } from "nanoid";
const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"
const nanoid = customAlphabet(alphaNumeric, 6);

export default nanoid;