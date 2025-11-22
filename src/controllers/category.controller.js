/**
 * Category Controller
 * Handles CRUD operations for categories
 * 
 * Available endpoints:
 * - GET /api/categories - Get all categories with pagination and search
 * - GET /api/categories/:id - Get category by ID
 * - GET /api/categories/slug/:slug - Get category by slug
 * - POST /api/categories - Create new category (Admin only)
 * - PUT /api/categories/:id - Update category (Admin only)
 * - DELETE /api/categories/:id - Delete category (Admin only)
 */

const prisma = require('../config/prisma');

const getAllCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      prisma.category.count({ where }),
    ]);

    res.json({
      success: true,
      data: categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon } = req.body;

    // Validasi input
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: name, slug',
      });
    }

    // Cek apakah name atau slug sudah ada
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: existingCategory.name === name 
          ? 'Nama kategori sudah digunakan' 
          : 'Slug sudah digunakan',
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon } = req.body;

    // Cek apakah category ada
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
      });
    }

    // Cek apakah name atau slug sudah digunakan oleh kategori lain
    if (name || slug) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: parseInt(id) } },
            {
              OR: [
                ...(name ? [{ name }] : []),
                ...(slug ? [{ slug }] : []),
              ],
            },
          ],
        },
      });

      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          message: duplicateCategory.name === name 
            ? 'Nama kategori sudah digunakan' 
            : 'Slug sudah digunakan',
        });
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
      },
    });

    res.json({
      success: true,
      message: 'Kategori berhasil diupdate',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah category ada
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

