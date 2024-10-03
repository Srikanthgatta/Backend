const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user')
 

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) =>{

return jwt.sign({id},  process.env.JWT_SECRET, {
    expiresIn:maxAge
})
  
}

/******** register ******/
exports.register = async (req,res) =>{

    console.log("-----------------",req.body)
    const {email,password} = req.body
 
    try {
   const existuser = await User.findOne({email:req.body.email})
    
           if(existuser){

               return res.status(401).json({msg:"Email already exists!"})
           }

    const user = new User(req.body)
    user.email=email.toLowerCase()

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password,salt) 
   
    await user.save();

    const token =  createToken(user._id);

    
      res.status(201).json({msg:"Register Successfully", user,token})
            
        } catch (error) {
                console.log(error)
                 res.status(401).json({err:"Something went wrong !",error})
            
        }
    }

/*******get all user******/

exports.getAllUser = async (req,res)=>{
    let search = req.query.search 

    try {
        if(req.query.search) {
            const filteruser =  await User.find({$or:[{user_name:{$regex:search,$options:'i'}},{phone_number:{$regex:search,$options:'i'}},
            {email:{$regex:search,$options:'i'}},
            ]})
 
            return res.status(201).json({msg:'Successfully',filteruser})
        }
 
        const user = await User.find({}).populate('department').sort({ createdAt:-1}).exec()
    
        res.status(201).json({msg:"Successfully", user})

    
    } catch (error) {
    
        res.status(401).json({err:"Something went wrong !",error})
    
    }
    
    }

    /*******get one user******/
    exports.getOneUser = async (req,res)=>{

        try {      
            const user = await User.findById(req.params.id).populate('department').exec()
            res.status(201).json({msg:"Successfully", user})
    
        } catch (error) {
            res.status(401).json({err:"Something went wrong !",error})
        
        }
        
        }
    

/*****update user**********/
exports.updateUser = async (req,res)=>{
    console.log(req.body);
        try{


            const user = await User.findById(req.params.id)
            
            console.log(req.body.password);
            if(req.body.password ) {
                
                const salt = await bcrypt.genSalt(10)
                user.password = await bcrypt.hash(req.body.password,salt) 
            }

            await User.updateOne({_id:req.params.id},req.body)
       
             
           await user.save()  
       

            res.status(201).json({msg:"User Updated Successfully"})

        } catch (error){
         console.log(error);
            res.status(401).json({msg:"Something went wrong !",error})

        }

    }

/*******delete user********/
exports.deleteUser = async (req,res)=>{

        try {
            
            const user = await User.findByIdAndDelete({_id:req.params.id})
            
            res.status(201).json({msg:"Deleted Successfully",user})
        
        } catch (error) {
        
                    res.status(401).json({err:"Something went wrong !",error})
        
        }
}


/*****user login********/
exports.login = async (req, res) => {
    const {email, password} = req.body
    try{  

           const user = await User.findOne({email : email})
            if(!user) {
                    return res.status(400).json({msg:'Invalid User'})
                  }
           const isMatch = await bcrypt.compare(password, user.password)
           if(!isMatch) {

            return  res.status(400).json({msg:'Invalid Password'})
        }
    
        
      const token = createToken(user._id);

      res.status(201).json({msg:'Logged-in Successfully', token, user})
    
     }catch(error){
         console.log(error)
        res.status(401).json({err:"Something went wrong !",error})
     }
    }
    
    
    /********user profile*********/
    exports.userProfile = async (req, res)=>{
        try {
           const user = await User.findById(req.user._id).select('-password')
    // console.log(user);
           if(!user) {
    
            return res.status(401).json({json:"no Authorization"})
           }
    
        res.status(201).json(user) 
    
        } catch (error) {
                res.status(401).json({msg:"Something went wrong"}) 
    
        }   
    }
    
    
    /******* Authenticate ********/
    exports.isAuthenticate = async (req, res, next) =>{
        console.log(req.headers.authorization)

        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        
        ){ 
            try {  
            
               let token = req.headers.authorization.split(' ')[1]
                         
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
                req.user = await User.findById(decoded.id).select('-password')
                next()
        
            } catch (error) {
        
                res.status(401).json({error:error.message}) 
            }
        }   else {

             res.status(500).json({msg:'UnAutherized Access'}) 
        }
    }
   