const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const cultureRoutes = require('./culture.routes');
const badgeRoutes = require('./badge.routes');
const challengeRoutes = require('./challenge.routes');
const certificateRoutes = require('./certificate.routes');
const articleRoutes = require('./article.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cultures', cultureRoutes);
router.use('/badges', badgeRoutes);
router.use('/challenges', challengeRoutes);
router.use('/certificates', certificateRoutes);
router.use('/articles', articleRoutes);

module.exports = router;
