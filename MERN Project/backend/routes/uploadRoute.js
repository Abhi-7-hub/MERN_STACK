const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const Profile = require('../models/Profile');

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const imageUrl = req.file.path;

    const profile = new Profile({
      name,
      email,
      mobile,
      imageUrl,
    });

    await profile.save();

    res.status(201).json({ message: 'Profile uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading profile' });
  }
});

module.exports = router;
