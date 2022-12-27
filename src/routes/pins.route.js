const express = require('express');
const router = express.Router();

const PinsController = require('../controllers/pins.controller');
const pinsController = new PinsController();
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/', authMiddleware, pinsController.createPin);

router.get('/', authMiddleware, pinsController.findAllPins);

router.get('/:pinId', authMiddleware, pinsController.findOnePin);

router.put('/:pinId', authMiddleware, pinsController.updatePin);

router.delete('/:pinId', authMiddleware, pinsController.deletePin);

//즐겨찾기 기능
router.put('/:pinId/likes', authMiddleware, pinsController.likePin);

module.exports = router;
