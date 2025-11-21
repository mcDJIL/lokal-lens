const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API untuk mengelola artikel budaya
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get semua artikel dengan filter dan pagination
 *     tags: [Articles]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan title, excerpt, atau content
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter berdasarkan kategori
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter berdasarkan provinsi
 *       - in: query
 *         name: isHighlight
 *         schema:
 *           type: boolean
 *         description: Filter artikel highlight
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan author
 *     responses:
 *       200:
 *         description: List artikel berhasil diambil
 */
router.get('/', articleController.getAllArticles);

/**
 * @swagger
 * /api/articles/my-articles:
 *   get:
 *     summary: Get artikel yang dibuat oleh user yang sedang login
 *     tags: [Articles]
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
 *     responses:
 *       200:
 *         description: List artikel user
 *       401:
 *         description: Unauthorized
 */
router.get('/my-articles', authenticate, articleController.getMyArticles);

/**
 * @swagger
 * /api/articles/my-bookmarks:
 *   get:
 *     summary: Get artikel yang di-bookmark oleh user
 *     tags: [Articles]
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
 *     responses:
 *       200:
 *         description: List bookmark artikel
 *       401:
 *         description: Unauthorized
 */
router.get('/my-bookmarks', authenticate, articleController.getMyBookmarks);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get artikel berdasarkan ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data artikel dengan comments
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.get('/:id', articleController.getArticleById);

/**
 * @swagger
 * /api/articles/slug/{slug}:
 *   get:
 *     summary: Get artikel berdasarkan slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data artikel dengan comments
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.get('/slug/:slug', articleController.getArticleBySlug);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Tambah artikel baru (Contributor/Admin)
 *     tags: [Articles]
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
 *               - slug
 *               - excerpt
 *               - content
 *               - featuredImage
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Mengenal Wayang Kulit
 *               slug:
 *                 type: string
 *                 example: mengenal-wayang-kulit
 *               excerpt:
 *                 type: string
 *                 example: Wayang kulit adalah seni pertunjukan tradisional Indonesia
 *               content:
 *                 type: string
 *                 example: Wayang kulit adalah salah satu puncak seni budaya Indonesia...
 *               featuredImage:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               category:
 *                 type: string
 *                 example: Seni & Budaya
 *               tags:
 *                 type: string
 *                 example: '["wayang", "jawa", "tradisi"]'
 *               province:
 *                 type: string
 *                 example: Jawa Tengah
 *               readTime:
 *                 type: integer
 *                 default: 5
 *                 example: 8
 *               isHighlight:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Artikel berhasil ditambahkan
 *       400:
 *         description: Input tidak valid atau slug sudah digunakan
 */
router.post('/', authenticate, authorize('admin', 'contributor'), articleController.createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Update artikel (Author atau Admin)
 *     tags: [Articles]
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
 *               slug:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *               province:
 *                 type: string
 *               readTime:
 *                 type: integer
 *               isHighlight:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Artikel berhasil diupdate
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.put('/:id', authenticate, articleController.updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Hapus artikel (Author atau Admin)
 *     tags: [Articles]
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
 *         description: Artikel berhasil dihapus
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.delete('/:id', authenticate, articleController.deleteArticle);

/**
 * @swagger
 * /api/articles/bookmark:
 *   post:
 *     summary: Toggle bookmark artikel
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - articleId
 *             properties:
 *               articleId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Bookmark berhasil ditoggle
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.post('/bookmark', authenticate, articleController.toggleBookmark);

module.exports = router;
