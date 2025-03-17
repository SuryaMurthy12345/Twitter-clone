import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" })
    
    //here jwt is name of cookie.
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //
        httpOnly: true, //prevents client side javascript from accessing the cookie attacks too. 
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
}