const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User');


// @route    Post api/users
// @desc     registered user
// @access   Public
router.post('/', [
        check('name', 'Name is required')
        .not()
        .isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('password', 'please use valid is password').isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            name,
            email,
            password
        } = req.body;
        console.log(req.body)
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({errors: [{msg: 'User already existe'}]});
            }
        const avatar = gravatar.url(email,{
            s: '200',
            r:'pg',
            d: 'm'
        })
        user = new User({
            name,email,password,avatar
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();

        // 
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload,config.get('jwtSecret'),{expiresIn: 360000},
        (err,token) => {
        if(err) throw err;
        res.json({token});
        })
            // res.send('User resgistered');
        } catch (error) {
            console.error(error.message);
            req.status(500).send('Server error')
        }
    });


module.exports = router;