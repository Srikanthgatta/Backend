const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type:String,
        trim:true,
        required:[true, 'is required'],
    },
    emp_name:{
        type:String,
        trim:true,
        required:[true, 'is required'],
    },
    employeeId:{
        type:String,
        trim:true,
        required:[true, 'is required'],
    },
    password:{
        type:String,
        trim:true,
        required:[true, 'is required'],
    },
    department:{
        type: Schema.Types.ObjectId, 
        ref: 'Department',
        required:[true, 'is required']
    },
    role:{
        type:String,
        trim:true,
        required:[true, 'is required'],
    },
    phone_no:{
        type:String,
    },
  
    }, {timestamps:true})


module.exports = mongoose.model('User', userSchema)