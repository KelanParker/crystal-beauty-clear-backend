import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export function saveUser(req, res) {
    // Check if user is logged in
    if (req.body.role === 'admin') {
        if (!req.user) {
            return res.status(403).json({ message: 'You need to log in First' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to create admin accounts' });
        }
    }

    // For regular user accounts, continue without authentication check
    if (req.body.role === 'user' || !req.body.role) {
        // Continue with user creation - no special checks needed
    }


    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone || 'Not given',
        role: req.body.role || 'user',
    });



    user.save()
        .then(() => {
            res.status(201).json({ message: "User saved successfully", user });
        })
        .catch((error) => {
            res.status(500).json({ message: "Error saving user", error });
        });
}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).
    then((user) => {
       if (user == null) {
           return res.status(404).json({ message: "Invalid email" });
       }
       const isPasswordValid = bcrypt.compareSync(password, user.password);
       if (!isPasswordValid) {
           return res.status(401).json({ message: "Invalid password" });
       }
    const userData = {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,  // ✅ Add this
        phone: user.phone,
        role: user.role,
        isDisabled: user.isDisabled,
        isEmailVerified: user.isEmailVerified,
    };


const token = jwt.sign(userData, "random123");
    res.json({
        message: "Login successful",
        user: userData,
        token: token 
    });
})
.catch((error) => {
    res.status(500).json({ message: "Error logging in", error });
});
}