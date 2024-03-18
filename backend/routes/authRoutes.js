import axios from 'axios';
import express from 'express';
import passport from 'passport';
import User from '../models/userModel.js';
import { generateToken } from '../utils/generateToken.js';
import 'dotenv/config';

const router = express.Router();

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}login/failed`,
  })
);

router.get('/google', async (req, res) => {
  try {
    const response = await axios.get(
      'https://accounts.google.com/o/oauth2/v2/auth',
      {
        params: req.query,
      }
    );

    console.log(response);

    res.send(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

// register or login to db
router.get('/login/success', async (req, res) => {
  if (req.user) {
    const userExists = await User.findOne({ email: req.user._json.email });
    if (userExists) {
      generateToken(res, userExists._id);
    } else {
      const newUser = new User({
        name: req.user._json.name,
        email: req.user._json.email,
        password: Date.now(),
      });
      generateToken(res, newUser._id);
      await newUser.save();
    }

    res.status(200).json({
      user: { ...req.user, isAdmin: userExists?.isAdmin },
      message: 'Login Successful',
      _id: userExists?._id,
    });
  } else {
    res.status(403).json({
      message: 'Not Authorized',
    });
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401);
  throw new Error('Login Failed');
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

export default router;
