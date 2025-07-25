import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    role : {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phone : {
        type: String,
        required: true,
        default: 'Not given'
    },
    isDisabled : {
        type: Boolean,
        required : true,
        default: false
    },
    isEmailVerified : {
        type: Boolean,
        required: true,
        default: false
    },
})

const User = mongoose.model('User', UserSchema);
export default User;
