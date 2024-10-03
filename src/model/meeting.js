const mongoose = require('mongoose')


const Schema = mongoose.Schema

const meetingSchema = new Schema({
    title:{
        type:String,
        trim:true,
        required:[true, 'is required'],
    },
    department:{
        type: Schema.Types.ObjectId, 
        ref: 'Department',
        required:[true, 'is required']
    },  
    attendees:[{
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required:[true, 'is required']
    }],   
    description:{
        type:String,
        trim:true,
        required:[true, 'is required'],

    },
    location:{
        type:String,
        trim:true,
        required:[true, 'is required'],
    },
    date:{
        type:String,
        trim:true,
        required:[true, 'is required'],

    },
    time:{
        type:String,
        trim:true,
        required:[true, 'is required'],
    },
    mom:{
        type:String,
        trim:true
    },
    meeting_organizer:{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    available_attendee:[{
        type: Schema.Types.ObjectId, 
        ref: 'User',
    }], 
    notavailable_attendee:[{
        type: Schema.Types.ObjectId, 
        ref: 'User',
    }],
    complition_status:{
        type:Boolean,
        trim:true,
        default:false
    },
    cancled_status:{
        type:Boolean,
        trim:true,
        default:false
    } 

},{timestamps:true})

module.exports = mongoose.model('Meeting',meetingSchema)