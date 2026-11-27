const userModel = require('../model/user.js');
const bcrypt = require('bcrypt')
const  sendEmail  = require('../utils/emails')
const otp_generator = require('otp-generator')


exports.signUp = async (req, res) => {
  try {
    const { fullName, email, gender, password, age } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({
        message: `User with Email: ${email} already exists`
      })
    }
const saltedRounds = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, saltedRounds)
   
const otp = otp_generator.generate(6,{ lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});


const data = {
      fullName,
      email: email.toLowerCase(),
      gender,
      password: hashedPassword,
      age,
      otp
    }

    const newUser = await userModel.create(data);
  
    const emailContent = {
            name: newUser.fullName,
            email: newUser.email,
            subject: 'Welcome to Zanzibar',
            htmlContent: `<html><head></head><body><p>Hello ${newUser.fullName},</p>we are thrilled to have you on board please use the otp to verify your account.</p><br> ${otp} </body></html>`
        };

        await sendEmail(emailContent);
    
        res.status(201).json({
      message: "User created successfully",
      data: newUser
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json({
      message: `All users found and the Total is: ${users.length}`,
      data: users
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

exports.getOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).populate('posts');

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    res.status(200).json({
      message: `User found`,
      data: user
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, gender, password, age } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }


    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({ email: email.toLowerCase() })
      if (emailExists) {
        return res.status(400).json({
          message: 'Email already in use'
        })
      }
    }

    const data = {
      fullName,
      gender,
      email,
      password,
      age
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


exports.Login = async (req, res)=>{
  
  try {
  const { email, password} = req.body
const user = await userModel.findOne({email: email.toLowerCase()})
if (!user) {
  return res.status(404).json({
    message: 'User not found'
  })
}
const isPasswordCorrect = await bcrypt.compare(password, user.password)
console.log(isPasswordCorrect)
  if (isPasswordCorrect == false) {
    return res.status(400).json({
      message: 'Invalid password'
    })
  }
 
if(user.isVerified == false) {
  return res.status(400).json({
    message: 'user not verified please check your email for the otp sent to you'
  })
}
  res.status(200).json({
    message: 'login successfully',
    data: user
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.verifyEmail = async (req, res) => {
try{
  const {email, otp} = req.body;
  const user = await userModel.findOne({email: email.toLowerCase()})
  if (!user) {
  return res.status(404).json({
  message: 'user not foundd '
  })

}

if (user.otp !== otp) {
    return res.status(400) .json({
    message: 'invalid otp'
  })
}

user.isVerified = true;
user.status = "active";
user.otp = null

//save the changes to database

await user.save()

res.status(200).json({
  message: 'account verified successfully',
data: user
})

} catch (error) {
  res.status(500).json({
    message: error.message
      })
  }
}


exports.forgotPassword = async (req,res) =>{
    try {
const {email}= req.body;
const user = await userModel.findOne({ email: email.toLowerCase()})
      if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
     
    }
const otp = otp_generator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})

const emailContent = {
            subject: 'password Reset',
            email,
            name: user.fullName,
            htmlContent: `<html><head></head><body><p>Hello ${user.fullName},</p>your password reset was initialized, below is your otp. if you did not initiate this request, please diregard this email.</p><br> ${otp} </body></html>`
        };
        user.otp = otp
        await sendEmail(emailContent)
        await user.save()
res.status(200).json({
  message: 'forgot password is successful'
})

      } catch (error) {
    res.status(500).json({
        message:error.message
    })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

   
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null;

    await user.save();

    return res.status(200).json({
      message: 'Password reset successful',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};