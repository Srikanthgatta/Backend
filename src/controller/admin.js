const Admin = require('../model/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/******** register admin ******/
exports.register = async (req, res) => {
    const { email, password, phone_no } = req.body;

    try {
        //test for password type
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            if (password.length < 8)
                return res
                    .status(400)
                    .json({ message: "Your password must have atleast 8 characters" })
            else
                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid password.Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.Password must be at least 8 characters long.",
                    })
        }
        else {
            //if there is no password fix needed, check with email and phone_no
            const userAvailable = await Admin.findOne({ email });
            if (userAvailable) {
                return res.status(400).json({ message: "User Already exists" })
            }
            const userPhoneAvailable = await Admin.findOne({ phone_no },{phone_no:1})
            if (userPhoneAvailable) {
                return res.status(400).json({ message: "This phone number is already registered.Use different phone number" })
            }


            //hash password and save it :if ph_no ,email are valid
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await Admin.create({
                email,
                phone_no,
                password: hashedPassword,
            })
            if (user) {
                res
                    .status(201)
                    .json({
                        _id: user._id,
                        message: `Admin Created Successfully!!`,
                    });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error in Admin creation! Internal Server error', error })
    }

}



/*****admin login********/
let attempts = {}
exports.login = async (req, res) => {
    const { email, password } = req.body
    try {

        const admin = await Admin.findOne({ email: email })
        if (!admin) {
            return res.status(400).json({ message: "Invalid User" })
        }
        if (admin.profile_locked) {
            return res.status(400).json({ message: "You have exceeded the maximum number of login attempts. Please change your password using forgot password" })
        }
        //admin exists and profile is not locked,compare passwords
        bcrypt.compare(password, admin.password, async (err, result) => {
            if (!result) {
                //wrong password
                if (!attempts[email]) {
                    attempts[email] = 1
                } else {
                    attempts[email]++
                }
                if (attempts[email] >= 3) {
                    // Lock the profile after three unsuccessful attempts
                    //set random password to the admin
                    bcrypt.hash(admin.password, 10, async (err, res) => {
                        if (res) {
                            await Admin.updateOne({ _id: admin._id }, { profile_locked: true, password: res })
                        }
                    })
                }
                return res.status(401).json({ message: `Invalid Password. Please try again only ${3 - attempts[email]} chances are left.` })

            }
            else {
                attempts[email] = 0
                const accessToken = jwt.sign({
                    user: {
                        id: admin._id,
                        email: admin.email
                    },
                }, process.env.JWT_SECRET, { expiresIn: "1min" })
                return res.status(200).json({ message: "Login successful", accessToken })

            }
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Internal Server error!", error })
    }
}


/*********admin-update :Password */
exports.update = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id)
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" })
        }
        const { password } = req.body;
        if (password) {
            admin.password = await bcrypt.hash(password, 10)
            attempts = {};
            admin.profile_locked = false;
            await admin.save();
            res.status(201).json({ message: "Password and profile updated successfully", admin })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server error!", error })
    }
}

/*******admin:validateToken ***********/
exports.validateToken = async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
  
    if (authHeader && authHeader.startsWith("Bearer")) {
      try {
        token = authHeader.split(" ")[1];
  
        if (!token) {
          // "Token absent";
          res.status(401).json({ message: "User is not Authorized or token is missing" })
        } else {
          jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
              // "Token invalid"
              res.status(401).json({ message: "User is not Authorized" })
            } else {
              req.user = decoded?.user;
              next();
            }
          });
        }
      } catch (error) {
        // "Error while verifying token:"
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      // "Bearer token not found in the request headers"
      res.status(401).json({ message: "User is not Authorized" })
    }
  }

  /********admin profile*********/
exports.adminProfile = async (req, res) => {
     try {
      const admin = await Admin.findById(req.user.id).select('-password').select('-profile_locked').select('-createdAt').select('-updatedAt')
      if (!admin) {
        return res.status(401).json({ message: "no Authorization" })
      }
      res.status(200).json({message:"User Authorized successfully",admin})
    } catch (error) {
      res.status(500).json({ message: "Internal server error" })
    }
}


