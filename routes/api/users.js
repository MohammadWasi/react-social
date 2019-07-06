const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');

const User = require('../../models/User')

// @route    Post api/users
// @desc     registered user
// @access   Public
router.post('/', [
    check('name','Name is required')
    .not()
    .isEmpty(),
    check('email','Email is required').isEmail(),
    check('password','please use valid is password').isLength({min:6})
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email,password} = req.body;
    console.log(req.body)
    try {
        
        res.send('User route');
    } catch (error) {
        console.error(error.message);
        req.status(500).send('Server error')
    }
});


module.exports = router;