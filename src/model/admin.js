const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    profile_locked:{
        type:Boolean,
        default:false
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:[true,'email is required']
    },
    phone_no:{
        type:Number,
        required:[true,'phone number is required']
    },
    password:{
        type:String,
        trim:true,
        required:[true,'password is required']
    }
},{timestamps:true})

module.exports = mongoose.model('Admin',adminSchema)

