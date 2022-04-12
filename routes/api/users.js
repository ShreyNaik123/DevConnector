const express = require('express');
const { check, validationResult } = require('express-validator')
const router = express.Router();
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const config = require('config')

// @route   POST -> api/users
// @desc    Register a new User
// @access  Public

// normally to do some things we will need tokens that will act as a means of authentication,but here we don't need tokens as therefore it is public 

router.post(
  '/',
  [
    // all of this is in the documentaton of express-validator
    check('name','Name is required')
      .not()
      .isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','Please enter a password of 6 or more characters').isLength({ min:6 })

  ],
async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors:errors.array() })
  }

  const { name,email,password } = req.body;

  // req body has all the attributes, we are using object destructuring to get the req.body.name/email/password in email,name and password

  try{
    // check if the email already exixts in the db
    let user = await User.findOne({ email });
    // if user has email already registered
    if(user){
      return res.status(400).json({errors: [{msg:'User already registered'}]})
    }
    // else
    const avatar = gravatar.url(email, {
      s:'200',
      r:'pg',
      d:'mm'
    })


    user = new User({
      name,
      email,
      avatar,
      password
    })

    // Encrypting the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);

    // saving the user to the database
    await user.save();
    // return jsonwebtoken
    // json web tokens are like passes that confirms that you are verified
    // we can make itb expire after a certain time

    const payload = {
      user:{
        id:user.id
        // this user.id is provided by mongodb
      }
    }
    jwt.sign(payload
      ,config.get('jsonwebSecret'),
      { expiresIn: 36000 },
      (err,token)=>{
        if(err) throw err;
        res.json({ token })

      })
      // before we deploy we have to make it about an hour

  }catch(err){
    res.status(500).send('Server error');
  }

});


// router.post(
//   '/',
//   check('name', 'Name is required').notEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check(
//     'password',
//     'Please enter a password with 6 or more characters'
//   ).isLength({ min: 6 }),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, email, password } = req.body;

//     try {
//       let user = await User.findOne({ email });

//       if (user) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'User already exists' }] });
//       }

//       const avatar = (
//         gravatar.url(email, {
//           s: '200',
//           r: 'pg',
//           d: 'mm'
//         })
//       );

//       user = new User({
//         name,
//         email,
//         avatar,
//         password
//       });

//       const salt = await bcrypt.genSalt(10);

//       user.password = await bcrypt.hash(password, salt);

//       await user.save();

//       const payload = {
//         user: {
//           id: user.id
//         }
//       };

//       jwt.sign(
//         payload,
//         config.get('jwtSecret'),
//         { expiresIn: '5 days' },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );


module.exports = router;
