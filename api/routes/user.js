const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');

//actualizar usuario
router.put('/:id', async (req, res) => {

    if (req.body.userId === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json('cuenta bien actualizada');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('actualizaste la cuenta!');
    }
});


//eliminar usuario
router.delete('/:id', async (req, res) => {

    if (req.body.userId === req.params.id || req.user.isAdmin) {

        try {
            res.status(200).json('cuenta eliminada');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('eliminaste la cuenta!');
    }
});

//GET FRIENDS
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friend => {
                return User.findById(friendId)
            })
        )
        let  friendList = [];
        friends.map((friend)=>{
            const {_id , username , profilePicture}=friend;
            friendList.push({_id,username,profilePicture});
        });
        res.status(200).json(friendList);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get user
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });

        const { password, updateAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        return res.status(500).json(err);
    }
});


//follow user 
router.put('/:id/follow', async (res, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.params.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.pull({ $push: { followings: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json('user has been followed');
            } else {
                res.status(403).json('you allready follow this user')
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('you cant follow yourself');
    }
});


router.get('/', (req, res) => {
    res.send("hey use rutes");
});

module.exports = router;