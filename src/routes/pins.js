const express = require('express');
const router = express.Router();

const PinsController = require('../controllers/pins.controller');
const pinsController = new PinsController();

router.post('/', pinsController.createPin);

router.get('/', pinsController.findAllPins);

router.get('/:pinId', pinsController.findOnePin);

router.put('/:pinId', pinsController.updatePin);

router.delete('/:pinId', pinsController.deletePin);
module.exports = router;
