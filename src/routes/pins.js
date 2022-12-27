const express = require('express');
const router = express.Router();

const PinsController = require('../controllers/pins.controller');
const pinsController = new PinsController();

router.get('/:pinId', pinsController.findOnePin);

module.exports = router;
