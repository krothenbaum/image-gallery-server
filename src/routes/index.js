const express = require('express');
const multer = require('multer');
// const mongoose = require('mongoose');
const Image = require('../models/image.model');


const router = express.Router();


const storage = multer.diskStorage ({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (reg, file, cb) => {
    const fileExtension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + Date.now() + '.'  + fileExtension);
  }
})
const upload = multer({ storage: storage });

router.get('/status', (req, res) => res.send('OK'));

router.get('/gallery', (req,res) => {
  res.send('GALLERY');
})

router.get('/form', (req, res) => {
  res.send('FORM');
  res.sendFile('../public/form.html');
})

router.post('/upload', upload.single('image'), async (req,res) => {
  // res.status(200).send('file uploaded');
  // console.log(req.file);
  try {
    const image = new Image({ fileName: req.file.filename});
    const savedUser = await image.save();
    res.status(200).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
})

module.exports = router;