const express = require('express');
const router = express.Router();

const pinsController = require('../controllers/pins.controller');

router.get('/:pinId', pinsController.findOnePin);

module.exports = router;
