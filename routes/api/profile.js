const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const request = require('request');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { response } = require('express');

// @route   GET -> api/profile/me
// @desc    Get my profile
// @access  Private

router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar']
		);
		// user pertains to the user parameter in profile schema and req.user.id is the id with which we have logged in as we are finding our own profile we have to check if user(id) is req.user.id
		// as Profile schema has only user id we need to use populate to bring in 'name' and 'gravatar' from user Schema and add it in the profile schema for the time being
		if (!profile) {
			return res.status(500).json({ msg: 'There is no profile for this user' });
		}
		return res.json(profile);
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({ msg: 'There is no profile for this user' });
	}
});

// @route   POST -> api/profile
// @desc    Create or Update Profiles
// @access  Private

router.post(
	'/',
	auth,
	check('status', 'Status is required').notEmpty(),
	check('skills', 'Skills is required').notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() });
		}
		// destructure the request
		const {
			website,
			youtube,
			twitter,
			instagram,
			linkedin,
			facebook,
			company,
			location,
			bio,
			skills,
			status,
			githubusername,
		} = req.body;

		// building a profile

		const profileFields = {
			user: req.user.id,
		};

		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;

		if (skills) {
			profileFields.skills = skills
				.toString()
				.split(' ')
				.map((skill) => skill.trim());
		}

		if (youtube) profileFields.youtube = youtube;
		if (twitter) profileFields.twitter = twitter;
		if (facebook) profileFields.facebook = facebook;
		if (linkedin) profileFields.linkdin = linkedin;
		if (instagram) profileFields.instagram = instagram;

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				// update
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
					// Usually findoneandupdate returns the object before updating after updating setting new:true makes it return the new updated object instead of the original one
				);
				return res.json(profile);
			}

			// create
			profile = await new Profile(profileFields);
			await profile.save();
			return res.json(profile);
		} catch (err) {
			return res.send(err.message);
		}
	}
);

// @route   GET -> api/profile
// @desc    Get all profiles
// @access  Public

router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		return res.json(profiles);
	} catch (err) {
		return res.status(500).json({ msg: 'Server Error' });
	}
});

// @route   GET -> api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public

router.get('/user/:user_id', async ({ params: { user_id } }, res) => {
	try {
		const profile = await Profile.findOne({ user: user_id }).populate('user', [
			'name',
			'avatar',
		]);
		if (!profile) {
			console.log(user_id);
			return res.json({ err: 'Profile not Found' });
		}

		return res.json(profile);
	} catch (err) {
		return res.status(500).json({ msg: 'Server Error' });
	}
});

// @route   Delete -> api/profile
// @desc    Delete profile, user and posts
// @access  Private

router.delete('/', auth, async (req, res) => {
	try {
		// Remove user posts
		// Remove profile
		// Remove user
		await Promise.all([
			Post.deleteMany({ user: req.user.id }),
			Profile.findOneAndRemove({ user: req.user.id }),
			User.findOneAndRemove({ _id: req.user.id }),
		]);

		res.json({ msg: 'User deleted' });
	} catch (err) {
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @route   PUT -> api/profile/experience
// @desc    Add Experience
// @access  Private

router.put(
	'/experience',
	[
		auth,
		check('title', 'Title is required').notEmpty(),
		check('company', 'Company is required').notEmpty(),
		check('from', 'From date is required').notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } =
			req.body;

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });
			//  UNSHIFT IS LIKE PUSH BUT IT PUSHES THE OBJECT AT THE FRONT
			profile.experience.unshift(req.body);
			await profile.save();

			res.json({ profile });
		} catch (err) {
			res.status(500).send('Server Error');
		}
	}
);

// @route   DELETE -> api/profile/experience/:exp_id
// @desc    Delete Profile
// @access  Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		// const profile = await Profile.findOne({ user: req.user.id })
		// const index = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

		// profile.experience.splice(index,1)
		// // splice parameters are index and the number till which the elements should be removed
		// // so from index of the experience till 1 that is only the index element should be removed

		// await profile.save();
		//  res.json({ profile })

		const foundProfile = await Profile.findOne({ user: req.user.id });

		foundProfile.experience = foundProfile.experience.filter(
			(exp) => exp._id.toString() !== req.params.exp_id
		);

		await foundProfile.save();
		return res.status(200).json(foundProfile);
	} catch (err) {
		res.status(500).send('Server Error');
	}
});

// @route   PUT -> api/profile/education
// @desc    Add education
// @access  Private

router.put(
	'/education',
	[
		auth,
		check('school', 'School is required').notEmpty(),
		check('degree', 'Degree is required').notEmpty(),
		check('fieldofstudy', 'Field of Study is required').notEmpty(),
		check('from', 'From date is required').notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() });
		}

		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body;

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(req.body);

			await profile.save();

			res.json({ profile });
		} catch (err) {
			res.status(500).send('Server Error');
		}
	}
);

// @route   DELETE -> api/profile/education/:edu_id
// @desc    Delete Profile
// @access  Private

router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const foundProfile = await Profile.findOne({ user: req.user.id });
		foundProfile.education = foundProfile.education.filter(
			(edu) => edu._id.toString() !== req.params.edu_id
		);
		await foundProfile.save();
		return res.status(200).json(foundProfile);
	} catch (err) {
		res.status(500).send('Server Error');
	}
});

// @route   GET -> api/profile/github/:username
// @desc    Get Github Repos
// @access  Public

router.get('/github/:username', (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.username
			}/repos?per_page=2&sort=created:asc&client_id=${config.get(
				'githubClientId'
			)}&client_secret-${config.get('githubSecret')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		};

		request(options, (error, resposne, body) => {
			if (error) console.error(error);

			if (response.statusCode != 200) {
				res.status(400).json({ msg: 'No User Exists' });
			}

			res.json(JSON.parse(body));
		});
	} catch (err) {
		return res.status(500).json({ err: 'Server Error' });
	}
});

module.exports = router;
