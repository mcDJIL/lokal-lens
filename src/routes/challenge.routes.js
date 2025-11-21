const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Challenges
 *   description: API untuk mengelola tantangan/challenges
 */

/**
 * @swagger
 * /api/challenges:
 *   get:
 *     summary: Get semua challenges dengan filter dan pagination
 *     tags: [Challenges]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [scan, quiz, article, exploration, social]
 *         description: Filter berdasarkan kategori
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filter berdasarkan tingkat kesulitan
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan title atau description
 *     responses:
 *       200:
 *         description: List challenges berhasil diambil
 */
router.get('/', challengeController.getAllChallenges);

/**
 * @swagger
 * /api/challenges/my-challenges:
 *   get:
 *     summary: Get challenges yang sudah diselesaikan user
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List challenges yang sudah diselesaikan
 *       401:
 *         description: Unauthorized
 */
router.get('/my-challenges', authenticate, challengeController.getUserChallenges);

/**
 * @swagger
 * /api/challenges/{id}:
 *   get:
 *     summary: Get challenge berdasarkan ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID challenge
 *     responses:
 *       200:
 *         description: Data challenge
 *       404:
 *         description: Challenge tidak ditemukan
 */
router.get('/:id', challengeController.getChallengeById);

/**
 * @swagger
 * /api/challenges:
 *   post:
 *     summary: Tambah challenge baru (Admin only)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - difficulty
 *               - requirements
 *             properties:
 *               title:
 *                 type: string
 *                 example: Petualangan Pertama
 *               description:
 *                 type: string
 *                 example: Scan objek budaya pertama kamu dan mulai petualanganmu!
 *               category:
 *                 type: string
 *                 enum: [scan, quiz, article, exploration, social]
 *                 example: scan
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: easy
 *               requirements:
 *                 type: string
 *                 example: Scan 1 objek budaya
 *               points:
 *                 type: integer
 *                 default: 0
 *                 example: 25
 *     responses:
 *       201:
 *         description: Challenge berhasil ditambahkan
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize('admin'), challengeController.createChallenge);

/**
 * @swagger
 * /api/challenges/{id}:
 *   put:
 *     summary: Update challenge (Admin only)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [scan, quiz, article, exploration, social]
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               requirements:
 *                 type: string
 *               points:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Challenge berhasil diupdate
 *       404:
 *         description: Challenge tidak ditemukan
 */
router.put('/:id', authenticate, authorize('admin'), challengeController.updateChallenge);

/**
 * @swagger
 * /api/challenges/{id}:
 *   delete:
 *     summary: Hapus challenge (Admin only)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Challenge berhasil dihapus
 *       404:
 *         description: Challenge tidak ditemukan
 */
router.delete('/:id', authenticate, authorize('admin'), challengeController.deleteChallenge);

/**
 * @swagger
 * /api/challenges/complete:
 *   post:
 *     summary: Tandai challenge sebagai selesai untuk user yang login
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challengeId
 *             properties:
 *               challengeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Challenge berhasil diselesaikan
 *       400:
 *         description: Challenge sudah diselesaikan sebelumnya
 *       404:
 *         description: Challenge tidak ditemukan
 */
router.post('/complete', authenticate, challengeController.completeChallenge);

/**
 * @swagger
 * /api/challenges/mark-complete:
 *   post:
 *     summary: Tandai challenge sebagai selesai untuk user tertentu (Admin only)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - challengeId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               challengeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Challenge berhasil ditandai selesai
 *       400:
 *         description: User sudah menyelesaikan challenge ini
 *       404:
 *         description: User atau challenge tidak ditemukan
 */
router.post('/mark-complete', authenticate, authorize('admin'), challengeController.markChallengeComplete);

/**
 * @swagger
 * /api/challenges/revoke/{userId}/{challengeId}:
 *   delete:
 *     summary: Cabut penyelesaian challenge dari user (Admin only)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Challenge completion berhasil dicabut
 *       404:
 *         description: User belum menyelesaikan challenge ini
 */
router.delete('/revoke/:userId/:challengeId', authenticate, authorize('admin'), challengeController.revokeChallengeCompletion);

module.exports = router;
