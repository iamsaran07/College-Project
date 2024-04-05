const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controller/imageController');
const { upload } = require('../middleware/upload');

router.post('/upload', upload, uploadImage);

module.exports = router;
