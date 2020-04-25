const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/isAuth');
const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put(
    '/signup',
    [
        body('email', 'Please enter a valid email.')
            .isEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password').trim().isLength({ min: 5 }),
        body('name').trim().not().isEmpty(),
    ],
    authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getStatus);

router.put(
    '/status',
    isAuth,
    [body('status').trim().not().isEmpty()],
    authController.updateStatus
);

module.exports = router;
