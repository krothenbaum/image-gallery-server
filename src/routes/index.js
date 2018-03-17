const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
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

const imageFilter = (req, file, cb) => {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

router.get('/status', (req, res) => res.send('OK'));

router.get('/gallery', async (req,res) => {
  try {
    let images = await Image.find({}).exec();
    console.log(images);
    res.status(200).send(images);
  } catch(err) {
    console.error(err);
  }
})

router.get('/form', (req, res) => {
  //Endpoint to upload photos
  res.send('FORM');
})

router.post('/upload', upload.single('image'), async (req,res) => {
  // res.status(200).send('file uploaded');
  // console.log(req.file);
  try {
    const image = new Image({ fileName: req.file.filename});
    const savedImage = await image.save();
    res.status(200).json(savedImage);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
})

module.exports = router;