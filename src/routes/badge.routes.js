const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badge.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Badges
 *   description: API untuk mengelola lencana/badges
 */

/**
 * @swagger
 * /api/badges:
 *   get:
 *     summary: Get semua badges dengan filter dan pagination
 *     tags: [Badges]
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
 *           enum: [explorer, collector, master, social, special]
 *         description: Filter berdasarkan kategori
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan nama atau deskripsi
 *     responses:
 *       200:
 *         description: List badges berhasil diambil
 */
router.get('/', badgeController.getAllBadges);

/**
 * @swagger
 * /api/badges/my-badges:
 *   get:
 *     summary: Get badges yang dimiliki user yang sedang login
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List badges user
 *       401:
 *         description: Unauthorized
 */
router.get('/my-badges', authenticate, badgeController.getUserBadges);

/**
 * @swagger
 * /api/badges/{id}:
 *   get:
 *     summary: Get badge berdasarkan ID
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID badge
 *     responses:
 *       200:
 *         description: Data badge
 *       404:
 *         description: Badge tidak ditemukan
 */
router.get('/:id', badgeController.getBadgeById);

/**
 * @swagger
 * /api/badges:
 *   post:
 *     summary: Tambah badge baru (Admin only)
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - icon
 *               - category
 *               - requirement
 *             properties:
 *               name:
 *                 type: string
 *                 example: Penjelajah Pemula
 *               description:
 *                 type: string
 *                 example: Scan 5 objek budaya pertama kamu
 *               icon:
 *                 type: string
 *                 example: 🔍
 *               category:
 *                 type: string
 *                 enum: [explorer, collector, master, social, special]
 *                 example: explorer
 *               requirement:
 *                 type: string
 *                 example: Scan 5 objek budaya
 *               points:
 *                 type: integer
 *                 default: 0
 *                 example: 50
 *     responses:
 *       201:
 *         description: Badge berhasil ditambahkan
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize('admin'), badgeController.createBadge);

/**
 * @swagger
 * /api/badges/{id}:
 *   put:
 *     summary: Update badge (Admin only)
 *     tags: [Badges]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [explorer, collector, master, social, special]
 *               requirement:
 *                 type: string
 *               points:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Badge berhasil diupdate
 *       404:
 *         description: Badge tidak ditemukan
 */
router.put('/:id', authenticate, authorize('admin'), badgeController.updateBadge);

/**
 * @swagger
 * /api/badges/{id}:
 *   delete:
 *     summary: Hapus badge (Admin only)
 *     tags: [Badges]
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
 *         description: Badge berhasil dihapus
 *       404:
 *         description: Badge tidak ditemukan
 */
router.delete('/:id', authenticate, authorize('admin'), badgeController.deleteBadge);

/**
 * @swagger
 * /api/badges/award:
 *   post:
 *     summary: Berikan badge ke user (Admin only)
 *     tags: [Badges]
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
 *               - badgeId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               badgeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Badge berhasil diberikan ke user
 *       400:
 *         description: User sudah memiliki badge ini
 *       404:
 *         description: User atau badge tidak ditemukan
 */
router.post('/award', authenticate, authorize('admin'), badgeController.awardBadgeToUser);

/**
 * @swagger
 * /api/badges/revoke/{userId}/{badgeId}:
 *   delete:
 *     summary: Cabut badge dari user (Admin only)
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: badgeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Badge berhasil dicabut dari user
 *       404:
 *         description: User tidak memiliki badge ini
 */
router.delete('/revoke/:userId/:badgeId', authenticate, authorize('admin'), badgeController.revokeBadgeFromUser);

module.exports = router;
