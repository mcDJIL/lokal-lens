const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API untuk manajemen user (Admin only)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get semua user dengan filter dan pagination (Admin/Officer)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin, contributor, officer]
 *         description: Filter berdasarkan role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan nama atau email
 *     responses:
 *       200:
 *         description: List user berhasil diambil
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, authorize('admin', 'officer'), userController.getAllUsers);

/**
 * @swagger
 * /api/users/statistics:
 *   get:
 *     summary: Get statistik user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik user
 *       401:
 *         description: Unauthorized
 */
router.get('/statistics', authenticate, authorize('admin'), userController.getUserStatistics);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get detail user berdasarkan ID (Admin/Officer)
 *     tags: [Users]
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
 *         description: Data user lengkap
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, authorize('admin', 'officer'), userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Tambah user baru (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 enum: [user, admin, contributor, officer]
 *                 default: user
 *     responses:
 *       201:
 *         description: User berhasil ditambahkan
 *       400:
 *         description: Email sudah terdaftar
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize('admin'), userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user (Admin only)
 *     tags: [Users]
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
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [user, admin, contributor, officer]
 *     responses:
 *       200:
 *         description: User berhasil diupdate
 *       400:
 *         description: Email sudah digunakan
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, authorize('admin'), userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Hapus user (Admin only)
 *     tags: [Users]
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
 *         description: User berhasil dihapus
 *       400:
 *         description: Tidak dapat menghapus akun sendiri
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

module.exports = router;
