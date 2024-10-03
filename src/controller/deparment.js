const Department = require('../model/department')

/***********Create Department */
exports.createDepartment = async(req,res)=>{
    try{

        const department = new Department(req.body)
        await department.save()
        
        res.status(201).json({msg:"Department Created Successfully",department})

    }catch(error){
        console.log(error)
        res.status(401).json({err:"Something went Wrong!",error})
    }
}


/**********Get All Department */
exports.getAllDepartment = async (req,res)=>{
    let search = req.query.search 
    try{
        if(req.query.search) {
            const filterDepartment =  await Department.find({$or:[{title:{$regex:search,$options:'i'}},{author:{$regex:search,$options:'i'}},{phone_no:{$regex:search}}
            ]})
            // console.log(filterDepartment)
             return res.status(201).json({msg:'Successfully',filterDepartment})
            }
        const department = await Department.find()
        res.status(201).json(department)
    }catch(error){
        console.log(error)
        res.status(401).json({err:"Something Went Wrong!",error})
    }
}

/*************get one Department */

exports.getOneDepartment = async(req,res)=>{
    try{
        const department = await Department.findById(req.params.id)
        res.status(201).json(department)

    }catch(error){
        res.status(401).json({err:"Something Went Wrong!!",error})
    }
}


/***********Update Department */
exports.updateDepartment = async(req,res)=>{
    console.log(req.params)
    try{
        await Department.updateOne({_id:req.params.id},req.body)
        res.status(201).json({msg:"Department Updated Successfully"})

    }catch(error){
        console.log(error)
        res.status(401).json({err:"Something Went Wrong!!",error})
    }
}

/***********Delete Department */
exports.deleteDepartment = async(req,res)=>{
    console.log(req.params.id)
    try{
        const department = await Department.findByIdAndDelete({_id:req.params.id})
        res.status(201).json({msg:"Department deleted Successfully",department})

    }catch(error){
        res.status(401).json({err:"Something went Wrong!!",error})
    }
}