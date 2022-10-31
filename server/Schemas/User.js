const {Schema, model} = require("mongoose")
const emailValidator = require("../utils/emailValidator.js")
const bcrypt = require("bcrypt")

const MAXIMUM_AGE = 120;
const MINIMUM_AGE = 1;

const AddressSchema = new Schema(
    {
        country: { type: String, default: "Israel" },
        city: { type: String, default: "Tel Aviv" },
        street: { type: String },
        zipCode: { type: Number },
    }
)

const UserSchema=new Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide a username"],
            unique: [true, "Username already exists"]
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: [true, "Email already exists"],
            validate: {
                validator: emailValidator,
                message: "invalid email"
            }
        },
        firstName: {type: String},
        lastName: {type: String},
        age: {
            type: Number,
            min: [MINIMUM_AGE, `Minimum age must be at least ${MINIMUM_AGE}`],
            max: [MAXIMUM_AGE, `Maximum age can't be more then ${MAXIMUM_AGE}`],
        },
        password: { type: String, required: [true, "Please provide a password"] },
        address: AddressSchema,
        createAt: { type: Date, default: Date.now, immutable: true },
        favorites: [{
            type: Schema.Types.ObjectId,
            ref: 'Shoe'
        }]
    }
)

UserSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, 11);
    next();
})

UserSchema.methods.truePassword = async function(userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

module.exports = model("User", UserSchema);