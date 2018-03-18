const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const mongoose = require('mongoose');
const Image = require('../models/image.model');
const sharp = require('sharp');
const router = express.Router();

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION
})
const s3 = new aws.S3();

// const storage = multer.diskStorage ({
//   destination: (req, file, cb) => {
//     cb(null, './public/images');
//   },
//   filename: (reg, file, cb) => {
//     const fileExtension = file.originalname.split('.').pop();
//     cb(null, file.fieldname + '-' + Date.now() + '.'  + fileExtension);
//   }
// })

const imageFilter = (req, file, cb) => {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// const upload = multer({ storage: storage, fileFilter: imageFilter });
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: (req, file, cb) => {
      console.log(file);
      cb(null, /^image/i.test(file.mimetype))
    },
    transforms: [{
      id: 'original',
      key: (req, file, cb) => {
        // const fileExtension = file.originalname.split('.').pop();
        cb(null, 'images/' + Date.now().toString() + '.jpg');
        // cb(null, 'image-original.jpg')
      },
      transform: (req, file, cb) => {
        cb(null, sharp().jpeg())
      }
    }, {
      id: 'thumbnail',
      key: (req, file, cb) => {
        cb(null, 'thumbs/' + Date.now().toString() + '.jpg')
      },
      transform: (req, file, cb) => {
        cb(null, sharp().resize(null, 300).jpeg())
      }
    }]
    // key: (req, file, cb) => {
    //   console.log(file);
    //   const fileExtension = file.originalname.split('.').pop();
    //   cb(null, file.fieldname + '-' + Date.now().toString() + '.'  + fileExtension);
    // }
  }),
  fileFilter: imageFilter
});

router.get('/status', (req, res) => res.send('OK'));

router.get('/gallery', async (req,res) => {
  try {
    let images = await Image.find({}).exec();
    // console.log(images);
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
  // console.log(req.file.transforms[0].key);
  try {
    const image = new Image({
      fileName: req.file.transforms[1].key,
      thumbName: req.file.transforms[0].key
    });
    const savedImage = await image.save();
    res.status(200).json(savedImage);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
})

module.exports = router;