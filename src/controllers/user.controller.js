const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
          profile: {
            select: {
              avatar: true,
              bio: true,
              provincesVisited: true,
              badgesEarned: true,
            },
          },
          _count: {
            select: {
              articles: true,
              articleComments: true,
              certificates: true,
              userBadges: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
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

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        profile: true,
        articles: {
          select: {
            id: true,
            title: true,
            slug: true,
            views: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        certificates: {
          select: {
            id: true,
            title: true,
            dateEarned: true,
          },
          orderBy: { dateEarned: 'desc' },
        },
        userBadges: {
          include: {
            badge: true,
          },
          orderBy: { earnedAt: 'desc' },
        },
        _count: {
          select: {
            articles: true,
            articleComments: true,
            certificates: true,
            userBadges: true,
            userCompleteChallenges: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role } = req.body;

    // Cek apakah user ada
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    // Cek apakah email sudah digunakan user lain
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan',
        });
      }
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(role && { role }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      message: 'User berhasil diupdate',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah user ada
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    // Tidak bisa hapus diri sendiri
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus akun sendiri',
      });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserStatistics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalContributors,
      totalOfficers,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { role: 'contributor' } }),
      prisma.user.count({ where: { role: 'officer' } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        usersByRole: {
          admin: totalAdmins,
          contributor: totalContributors,
          officer: totalOfficers,
          user: totalUsers - totalAdmins - totalContributors - totalOfficers,
        },
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Validasi input
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, dan fullName wajib diisi',
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: role || 'user',
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User berhasil ditambahkan',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStatistics,
  createUser,
};
