const express = require('express')
const Router =  express.Router()

const {register,login,update,validateToken,adminProfile} = require('../controller/admin')

Router.post('/admins/sign-up',register)
Router.post('/admins/sign-in',login)
Router.put('/admins/:id',update)
Router.get('/admins/profile',validateToken,adminProfile)


module.exports = Router