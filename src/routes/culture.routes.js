const express = require('express');
const router = express.Router();
const cultureController = require('../controllers/culture.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Cultures
 *   description: API untuk mengelola data budaya
 */

/**
 * @swagger
 * /api/cultures:
 *   get:
 *     summary: Get semua budaya dengan filter dan pagination
 *     tags: [Cultures]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan nama, deskripsi, atau lokasi
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter berdasarkan provinsi
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter berdasarkan kota
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [tarian, musik, pakaian, arsitektur, kuliner, upacara, kerajinan, senjata, permainan, bahasa]
 *         description: Filter berdasarkan kategori
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, draft]
 *           default: active
 *         description: Filter berdasarkan status
 *       - in: query
 *         name: isEndangered
 *         schema:
 *           type: boolean
 *         description: Filter budaya yang terancam punah
 *     responses:
 *       200:
 *         description: List budaya berhasil diambil
 */
router.get('/', cultureController.getAllCultures);

/**
 * @swagger
 * /api/cultures/{id}:
 *   get:
 *     summary: Get budaya berdasarkan ID
 *     tags: [Cultures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID budaya
 *     responses:
 *       200:
 *         description: Data budaya
 *       404:
 *         description: Budaya tidak ditemukan
 */
router.get('/:id', cultureController.getCultureById);

/**
 * @swagger
 * /api/cultures/slug/{slug}:
 *   get:
 *     summary: Get budaya berdasarkan slug
 *     tags: [Cultures]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug budaya
 *     responses:
 *       200:
 *         description: Data budaya
 *       404:
 *         description: Budaya tidak ditemukan
 */
router.get('/slug/:slug', cultureController.getCultureBySlug);

/**
 * @swagger
 * /api/cultures:
 *   post:
 *     summary: Tambah budaya baru (Admin/Contributor/Officer)
 *     tags: [Cultures]
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
 *               - slug
 *               - description
 *               - location
 *               - province
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tari Kecak
 *               slug:
 *                 type: string
 *                 example: tari-kecak
 *               subtitle:
 *                 type: string
 *                 example: Tarian Tradisional Bali
 *               description:
 *                 type: string
 *                 example: Tari Kecak adalah tarian tradisional dari Bali
 *               longDescription:
 *                 type: string
 *               meaning:
 *                 type: string
 *               location:
 *                 type: string
 *                 example: Bali, Indonesia
 *               province:
 *                 type: string
 *                 example: Bali
 *               city:
 *                 type: string
 *                 example: Denpasar
 *               latitude:
 *                 type: number
 *                 example: -8.6705
 *               longitude:
 *                 type: number
 *                 example: 115.2126
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft]
 *                 default: active
 *               isEndangered:
 *                 type: boolean
 *                 default: false
 *               thumbnail:
 *                 type: string
 *               mapEmbedUrl:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [tarian, musik, pakaian, arsitektur, kuliner, upacara, kerajinan, senjata, permainan, bahasa]
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                     altText:
 *                       type: string
 *                     isPrimary:
 *                       type: boolean
 *                     displayOrder:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Budaya berhasil ditambahkan
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize('admin', 'contributor', 'officer'), cultureController.createCulture);

/**
 * @swagger
 * /api/cultures/{id}:
 *   put:
 *     summary: Update budaya (Admin/Contributor/Officer)
 *     tags: [Cultures]
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
 *               slug:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               longDescription:
 *                 type: string
 *               meaning:
 *                 type: string
 *               location:
 *                 type: string
 *               province:
 *                 type: string
 *               city:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft]
 *               isEndangered:
 *                 type: boolean
 *               thumbnail:
 *                 type: string
 *               mapEmbedUrl:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Budaya berhasil diupdate
 *       404:
 *         description: Budaya tidak ditemukan
 */
router.put('/:id', authenticate, authorize('admin', 'contributor', 'officer'), cultureController.updateCulture);

/**
 * @swagger
 * /api/cultures/{id}:
 *   delete:
 *     summary: Hapus budaya (Admin/Officer)
 *     tags: [Cultures]
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
 *         description: Budaya berhasil dihapus
 *       404:
 *         description: Budaya tidak ditemukan
 */
router.delete('/:id', authenticate, authorize('admin', 'officer'), cultureController.deleteCulture);

/**
 * @swagger
 * /api/cultures/{id}/images:
 *   post:
 *     summary: Tambah gambar ke budaya (Admin/Contributor/Officer)
 *     tags: [Cultures]
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
 *             required:
 *               - imageUrl
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               altText:
 *                 type: string
 *                 example: Tari Kecak Performance
 *               isPrimary:
 *                 type: boolean
 *                 default: false
 *               displayOrder:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Gambar berhasil ditambahkan
 */
router.post('/:id/images', authenticate, authorize('admin', 'contributor', 'officer'), cultureController.addCultureImage);

/**
 * @swagger
 * /api/cultures/{id}/images/{imageId}:
 *   delete:
 *     summary: Hapus gambar budaya (Admin/Officer)
 *     tags: [Cultures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gambar berhasil dihapus
 *       404:
 *         description: Gambar tidak ditemukan
 */
router.delete('/:id/images/:imageId', authenticate, authorize('admin', 'officer'), cultureController.deleteCultureImage);

module.exports = router;
