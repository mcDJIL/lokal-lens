const prisma = require('../config/prisma');

const getAllCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(userId && { userId: parseInt(userId) }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { dateEarned: 'desc' },
      }),
      prisma.certificate.count({ where }),
    ]);

    res.json({
      success: true,
      data: certificates,
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

const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Sertifikat tidak ditemukan',
      });
    }

    res.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.userId;

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      orderBy: { dateEarned: 'desc' },
    });

    res.json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCertificate = async (req, res) => {
  try {
    const { userId, title, description, dateEarned, certificateUrl } = req.body;

    // Validasi input
    if (!userId || !title || !dateEarned) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: userId, title, dateEarned',
      });
    }

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId: parseInt(userId),
        title,
        description,
        dateEarned: new Date(dateEarned),
        certificateUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Sertifikat berhasil ditambahkan',
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dateEarned, certificateUrl } = req.body;

    // Cek apakah certificate ada
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCertificate) {
      return res.status(404).json({
        success: false,
        message: 'Sertifikat tidak ditemukan',
      });
    }

    const certificate = await prisma.certificate.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(dateEarned && { dateEarned: new Date(dateEarned) }),
        ...(certificateUrl !== undefined && { certificateUrl }),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Sertifikat berhasil diupdate',
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah certificate ada
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCertificate) {
      return res.status(404).json({
        success: false,
        message: 'Sertifikat tidak ditemukan',
      });
    }

    await prisma.certificate.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Sertifikat berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const issueCertificate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, certificateUrl } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title wajib diisi',
      });
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        title,
        description,
        dateEarned: new Date(),
        certificateUrl,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Sertifikat berhasil diterbitkan',
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCertificates,
  getCertificateById,
  getUserCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  issueCertificate,
};
