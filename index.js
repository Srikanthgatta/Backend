const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan');
const cors = require('cors')
const admin = require('./src/router/admin')
const user = require('./src/router/user')
const department = require('./src/router/department')
const meeting = require('./src/router/meeting')


const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()
connectDB()

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }

  app.use('/api', admin)
  app.use('/api', user)
  app.use('/api', department)
  app.use('/api', meeting)

  const server = app.listen(PORT,(err)=>{
    if(!err)
    console.log(`Server is running on PORT ${PORT}`)
})