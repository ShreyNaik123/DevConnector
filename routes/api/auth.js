const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// @route   GET -> api/auth
// @desc    Test Route
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		// as we did req.user = decoded.user in middleware/auth we can use req.user anywhere nows
		// this gets the user with that id and removes the password
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   POST -> api/auth
// @desc    Login User
// @access  Public

router.post(
	'/',
	[
		// all of this is in the documentaton of express-validator
		check('email', 'Please enter a valid email').isEmail(),
		check('password', 'Password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;
		// as for login we only require the email and the password, thats what we are going to include in the request body

		// req body has all the attributes, we are using object destructuring to get the req.body.name/email/password in email,name and password

		try {
			// check if the email already exixts in the db
			let user = await User.findOne({ email });
			// if user has email already registered
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] });
			}
			// else

			let isaMatch = await bcrypt.compare(password, user.password);
			// password is what we include in the request body and user.password is what we feteched from the db for that email
			if (!isaMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] });
			}

			const payload = {
				user: {
					id: user.id,
					// this user.id is provided by mongodb
				},
			};
			jwt.sign(
				payload,
				config.get('jsonwebSecret'),
				{ expiresIn: 36000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
			// before we deploy we have to make it about an hour
		} catch (err) {
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
