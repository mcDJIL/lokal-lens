const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: API untuk mengelola sertifikat
 */

/**
 * @swagger
 * /api/certificates:
 *   get:
 *     summary: Get semua sertifikat dengan filter dan pagination (Admin/Officer)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
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
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan user ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan title atau description
 *     responses:
 *       200:
 *         description: List sertifikat berhasil diambil
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, authorize('admin', 'officer'), certificateController.getAllCertificates);

/**
 * @swagger
 * /api/certificates/my-certificates:
 *   get:
 *     summary: Get sertifikat yang dimiliki user yang sedang login
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List sertifikat user
 *       401:
 *         description: Unauthorized
 */
router.get('/my-certificates', authenticate, certificateController.getUserCertificates);

/**
 * @swagger
 * /api/certificates/{id}:
 *   get:
 *     summary: Get sertifikat berdasarkan ID
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sertifikat
 *     responses:
 *       200:
 *         description: Data sertifikat
 *       404:
 *         description: Sertifikat tidak ditemukan
 */
router.get('/:id', certificateController.getCertificateById);

/**
 * @swagger
 * /api/certificates:
 *   post:
 *     summary: Tambah sertifikat baru untuk user tertentu (Admin/Officer)
 *     tags: [Certificates]
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
 *               - title
 *               - dateEarned
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: Duta Budaya Lokal Lens
 *               description:
 *                 type: string
 *                 example: Penghargaan untuk kontribusi luar biasa dalam melestarikan budaya nusantara
 *               dateEarned:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               certificateUrl:
 *                 type: string
 *                 example: https://example.com/certificates/duta-budaya.pdf
 *     responses:
 *       201:
 *         description: Sertifikat berhasil ditambahkan
 *       400:
 *         description: Input tidak valid
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize('admin', 'officer'), certificateController.createCertificate);

/**
 * @swagger
 * /api/certificates/issue:
 *   post:
 *     summary: Terbitkan sertifikat untuk user yang sedang login
 *     tags: [Certificates]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: Kontributor Aktif
 *               description:
 *                 type: string
 *                 example: Apresiasi untuk kontribusi aktif dalam platform
 *               certificateUrl:
 *                 type: string
 *                 example: https://example.com/certificates/contributor.pdf
 *     responses:
 *       201:
 *         description: Sertifikat berhasil diterbitkan
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 */
router.post('/issue', authenticate, certificateController.issueCertificate);

/**
 * @swagger
 * /api/certificates/{id}:
 *   put:
 *     summary: Update sertifikat (Admin/Officer)
 *     tags: [Certificates]
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
 *               dateEarned:
 *                 type: string
 *                 format: date
 *               certificateUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sertifikat berhasil diupdate
 *       404:
 *         description: Sertifikat tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, authorize('admin', 'officer'), certificateController.updateCertificate);

/**
 * @swagger
 * /api/certificates/{id}:
 *   delete:
 *     summary: Hapus sertifikat (Admin only)
 *     tags: [Certificates]
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
 *         description: Sertifikat berhasil dihapus
 *       404:
 *         description: Sertifikat tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, authorize('admin'), certificateController.deleteCertificate);

module.exports = router;
