const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const passport = require('passport');

router.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            return res.status(500).json(err);
        }
        passport.authenticate('local')(req, res, () => {
            res.status(200).json({ message: 'Registration successful' });
        });
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Login successful' });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Logout successful' });
});

router.get('/checkAuth', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ authenticated: true });
    } else {
        res.status(200).json({ authenticated: false });
    }
});

router.post('/posts', (req, res) => {
    if (req.isAuthenticated()) {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id
        });
        newPost.save((err, post) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json({ message: 'Post created', post });
        });
    } else {
        res.status(403).json({ message: 'Not authenticated' });
    }
});

router.get('/posts', (req, res) => {
    Post.find()
        .populate('author', 'username')
        .exec((err, posts) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json(posts);
        });
});

module.exports = router;