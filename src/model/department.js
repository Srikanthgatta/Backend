const mongoose = require('mongoose')


const Schema = mongoose.Schema

const departmentSchema = new Schema({
    department_name:{
        type:String,
        trim:true,
        required:[true, 'is required'],

    }
},{timestamps:true})

module.exports = mongoose.model('Department',departmentSchema)