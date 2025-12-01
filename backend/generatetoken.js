const jwt = require("jsonwebtoken");

const token = jwt.sign(
    { user: {id: "692dd91cb39f7acf666690a2"} }, "d6727b9e-8a23-455b-a22c-35e28fc81262", {expiresIn: "30d" }
);

console.log(token);