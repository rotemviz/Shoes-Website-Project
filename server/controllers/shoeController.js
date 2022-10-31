const ErrorManager = require("../utils/ErrorManager");
const Shoe = require("../Schemas/Shoe");
const User = require("../Schemas/User");

exports.create = async (req, res, next) => {
    try {
        const {model} = req.body;
        const potentialExistsShoe = await Shoe.findOne(
            {model: model}
        );
        if(potentialExistsShoe)
            return next(new ErrorManager("Shoe model already exist", 400));
        const newShoe = await Shoe.create(req.body);
        res.status(201).json({message: "Success"});
    }
    catch(error) {
        const errorMsg = Object.values(error.errors)[0];
        next(new ErrorManager(errorMsg, 400));
    }
};

exports.all = async (req, res, next) => {
    try {
        const allShoes = await Shoe.find();
        res.status(200).json(allShoes);
    }
    catch(error) {
        next(new ErrorManager("Something went wrong"));
    }
}

exports.addShoeToUserFavorites = async (req, res, next) => {
    try {
        const {shoeId, user} = req.body;
        if(user.favorites.includes(shoeId))
            return next(new ErrorManager("Shoe is already in favorites", 400));
        await User.findByIdAndUpdate(
            {_id: user._id},
            {$push: {favorites: shoeId}}
        )
        res.status(202).json({messege: "Success"});
    }
    catch(error) {
        next(new ErrorManager("Something went wrong"));
    }
}

exports.showUserFavorites = async (req, res, next) => {
    try {
        const userFavoritesIdArray = req.body.favorites;
        if(userFavoritesIdArray.length === 0)
            return next(new ErrorManager("No favorites shoes has been added", 404));
        const userFavoritesShoesArray = await Shoe.find({"_id": {"$in": userFavoritesIdArray}});
        res.status(200).json(userFavoritesShoesArray);
    }
    catch(error) {
        next(new ErrorManager("Something went wrong"));
    }
}

exports.removeFromUserFavorites = async (req, res, next) => {
    try {
        const {shoeId, user} = req.body;
        if(!user.favorites.includes(shoeId))
            return next(new ErrorManager("Shoe is already out of user favorites", 400));
        await User.findByIdAndUpdate(
            {_id: user._id},
            {$pull: {favorites: shoeId}}
        )
        if(user.favorites.length === 1)
            return res.status(202).json({message: "needs reload"});
        res.status(202).json({message: "Success"});
    }
    catch(error) {
        next(new ErrorManager("Something went wrong"));
    }
}

exports.searchShoe = async (req, res, next) => {
    try {
        const {searchContent} = req.body;
        let searchResult;
        const searchResultBrand = await Shoe.find({
            $and: [
                {brand:{$regex: searchContent}},
            ]
        });
        const searchResultModel = await Shoe.find({
            $and: [
                {model:{$regex: searchContent}},
            ]
        });
        if(searchResultBrand.length > searchResultModel.length)
            searchResult = searchResultBrand;
        else
            searchResult = searchResultModel;
        if(searchResult.length === 0)
            return next(new ErrorManager("No shoes has been found..", 404));
        res.status(302).json(searchResult);
    }    
    catch(error) {
        next(new ErrorManager("Something went wrong"));
    }
}