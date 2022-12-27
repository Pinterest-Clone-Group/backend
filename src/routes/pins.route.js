const express = require('express');
const router = express.Router();

const PinsController = require('../controllers/pins.controller');
const pinsController = new PinsController();
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/', pinsController.createPin);

router.get('/', pinsController.findAllPins);

router.get('/:pinId', pinsController.findOnePin);

router.put('/:pinId', pinsController.updatePin);

router.delete('/:pinId', pinsController.deletePin);

//즐겨찾기 기능
router.put('/:pinId/likes', authMiddleware, pinsController.likePin);

module.exports = router;
