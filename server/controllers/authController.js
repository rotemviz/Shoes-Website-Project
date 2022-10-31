const User = require("../Schemas/User");
const jwt = require("jsonwebtoken");
const ErrorManager = require("../utils/ErrorManager");

function tokenCreator({_id}) {
    return jwt.sign({id: _id}, process.env.JWT_SECRET);
}

exports.register = async (req, res, next) => {
    try {
        const {username, email} = req.body;
        const potentialUserUsername = await User.findOne({username});
        const potentialUserEmail = await User.findOne({email});
        if(potentialUserUsername !== null)
            return next(new ErrorManager("Username already exists", 400));
        if(potentialUserEmail !== null)
            return next(new ErrorManager("Email already exists", 400));
        const newUser = await User.create(req.body);
        newUser.password = undefined;
        const token = tokenCreator(newUser);
        res.status(201).json({ token });
    }
    catch(error) {
        const errorMsg = Object.values(error.errors)[0];
        next(new ErrorManager(errorMsg, 400));
    }
}

exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        if(!username || !password)
            next(new ErrorManager("Please provide username and password", 400));
        const user = await User.findOne({username});
        if(!user)
            return next(new ErrorManager("User doesn't exists", 404));
        if(!(await user.truePassword(password)))
            return next(new ErrorManager("Password doesn't match", 403));
        const token = tokenCreator(user);
        res.status(200).json({token});
    }
    catch (error) {
        next(new ErrorManager("Something went wrong"));
    }
}

exports.authentication = async (req, res, next) => {
    try {
        const {token} = req.body;
        if(!token)
            return next(new ErrorManager("Token needs to be provided", 400));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        user.password = undefined;
        res.status(200).json({user});
    }
    catch(error) {
        next(new ErrorManager("Something went wrong"));
    }
}