const router = require('express').Router();
const User = require('../models/User');

//Register
router.get('/register', async (req, res) => {

    const user = await new User({//creamos el user
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    try {
        const user = await newUser.save();//guardamos el user
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json('user no econtrado');

        const validPassword = await bcrypt.compare(req.bodu.password, user.password)
        !validPassword && res.status(400).json('wrong password')

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;
