const prisma = require('../config/prisma');

const getAllCultures = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      province, 
      city, 
      category, 
      status = 'active',
      isEndangered 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { location: { contains: search } },
        ],
      }),
      ...(province && { province }),
      ...(city && { city }),
      ...(category && { category }),
      ...(isEndangered !== undefined && { isEndangered: isEndangered === 'true' }),
    };

    const [cultures, total] = await Promise.all([
      prisma.culture.findMany({
        where,
        skip,
        take,
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.culture.count({ where }),
    ]);

    res.json({
      success: true,
      data: cultures,
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

const getCultureById = async (req, res) => {
  try {
    const { id } = req.params;

    const culture = await prisma.culture.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!culture) {
      return res.status(404).json({
        success: false,
        message: 'Budaya tidak ditemukan',
      });
    }

    res.json({
      success: true,
      data: culture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCultureBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const culture = await prisma.culture.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!culture) {
      return res.status(404).json({
        success: false,
        message: 'Budaya tidak ditemukan',
      });
    }

    res.json({
      success: true,
      data: culture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCulture = async (req, res) => {
  try {
    const {
      name,
      slug,
      subtitle,
      description,
      longDescription,
      meaning,
      location,
      province,
      city,
      latitude,
      longitude,
      status,
      isEndangered,
      thumbnail,
      mapEmbedUrl,
      category,
      images,
    } = req.body;

    // Validasi input
    if (!name || !slug || !description || !location || !province || !city) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: name, slug, description, location, province, city',
      });
    }

    // Cek apakah slug sudah ada
    const existingCulture = await prisma.culture.findUnique({
      where: { slug },
    });

    if (existingCulture) {
      return res.status(400).json({
        success: false,
        message: 'Slug sudah digunakan',
      });
    }

    // Buat culture baru
    const culture = await prisma.culture.create({
      data: {
        name,
        slug,
        subtitle,
        description,
        longDescription,
        meaning,
        location,
        province,
        city,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        status: status || 'active',
        isEndangered: isEndangered || false,
        thumbnail,
        mapEmbedUrl,
        category,
        ...(images && images.length > 0 && {
          images: {
            create: images.map((img, index) => ({
              imageUrl: img.imageUrl,
              altText: img.altText,
              isPrimary: img.isPrimary || false,
              displayOrder: img.displayOrder || index,
            })),
          },
        }),
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Budaya berhasil ditambahkan',
      data: culture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCulture = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      subtitle,
      description,
      longDescription,
      meaning,
      location,
      province,
      city,
      latitude,
      longitude,
      status,
      isEndangered,
      thumbnail,
      mapEmbedUrl,
      category,
    } = req.body;

    // Cek apakah culture ada
    const existingCulture = await prisma.culture.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCulture) {
      return res.status(404).json({
        success: false,
        message: 'Budaya tidak ditemukan',
      });
    }

    // Cek apakah slug sudah digunakan oleh culture lain
    if (slug && slug !== existingCulture.slug) {
      const slugExists = await prisma.culture.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Slug sudah digunakan',
        });
      }
    }

    // Update culture
    const culture = await prisma.culture.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description && { description }),
        ...(longDescription !== undefined && { longDescription }),
        ...(meaning !== undefined && { meaning }),
        ...(location && { location }),
        ...(province && { province }),
        ...(city && { city }),
        ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
        ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null }),
        ...(status && { status }),
        ...(isEndangered !== undefined && { isEndangered }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(mapEmbedUrl !== undefined && { mapEmbedUrl }),
        ...(category !== undefined && { category }),
      },
      include: {
        images: true,
      },
    });

    res.json({
      success: true,
      message: 'Budaya berhasil diupdate',
      data: culture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCulture = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah culture ada
    const existingCulture = await prisma.culture.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCulture) {
      return res.status(404).json({
        success: false,
        message: 'Budaya tidak ditemukan',
      });
    }

    // Hapus culture (images akan terhapus otomatis karena cascade)
    await prisma.culture.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Budaya berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addCultureImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, altText, isPrimary, displayOrder } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'imageUrl wajib diisi',
      });
    }

    // Cek apakah culture ada
    const culture = await prisma.culture.findUnique({
      where: { id: parseInt(id) },
    });

    if (!culture) {
      return res.status(404).json({
        success: false,
        message: 'Budaya tidak ditemukan',
      });
    }

    // Jika isPrimary true, set semua image lain jadi false
    if (isPrimary) {
      await prisma.cultureImage.updateMany({
        where: { cultureId: parseInt(id) },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.cultureImage.create({
      data: {
        cultureId: parseInt(id),
        imageUrl,
        altText,
        isPrimary: isPrimary || false,
        displayOrder: displayOrder || 0,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Gambar berhasil ditambahkan',
      data: image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCultureImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    // Cek apakah image ada
    const image = await prisma.cultureImage.findUnique({
      where: { id: parseInt(imageId) },
    });

    if (!image || image.cultureId !== parseInt(id)) {
      return res.status(404).json({
        success: false,
        message: 'Gambar tidak ditemukan',
      });
    }

    await prisma.cultureImage.delete({
      where: { id: parseInt(imageId) },
    });

    res.json({
      success: true,
      message: 'Gambar berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCultures,
  getCultureById,
  getCultureBySlug,
  createCulture,
  updateCulture,
  deleteCulture,
  addCultureImage,
  deleteCultureImage,
};
