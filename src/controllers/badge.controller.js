const prisma = require('../config/prisma');

const getAllBadges = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    const [badges, total] = await Promise.all([
      prisma.badge.findMany({
        where,
        skip,
        take,
        orderBy: { points: 'asc' },
      }),
      prisma.badge.count({ where }),
    ]);

    res.json({
      success: true,
      data: badges,
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

const getBadgeById = async (req, res) => {
  try {
    const { id } = req.params;

    const badge = await prisma.badge.findUnique({
      where: { id: parseInt(id) },
      include: {
        userBadges: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge tidak ditemukan',
      });
    }

    res.json({
      success: true,
      data: badge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createBadge = async (req, res) => {
  try {
    const { name, description, icon, category, requirement, points } = req.body;

    // Validasi input
    if (!name || !description || !icon || !category || !requirement) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: name, description, icon, category, requirement',
      });
    }

    const badge = await prisma.badge.create({
      data: {
        name,
        description,
        icon,
        category,
        requirement,
        points: points || 0,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Badge berhasil ditambahkan',
      data: badge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, category, requirement, points } = req.body;

    // Cek apakah badge ada
    const existingBadge = await prisma.badge.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBadge) {
      return res.status(404).json({
        success: false,
        message: 'Badge tidak ditemukan',
      });
    }

    const badge = await prisma.badge.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(icon && { icon }),
        ...(category && { category }),
        ...(requirement && { requirement }),
        ...(points !== undefined && { points }),
      },
    });

    res.json({
      success: true,
      message: 'Badge berhasil diupdate',
      data: badge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah badge ada
    const existingBadge = await prisma.badge.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBadge) {
      return res.status(404).json({
        success: false,
        message: 'Badge tidak ditemukan',
      });
    }

    await prisma.badge.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Badge berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserBadges = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
    });

    res.json({
      success: true,
      data: userBadges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const awardBadgeToUser = async (req, res) => {
  try {
    const { userId, badgeId } = req.body;

    if (!userId || !badgeId) {
      return res.status(400).json({
        success: false,
        message: 'userId dan badgeId wajib diisi',
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

    // Cek apakah badge ada
    const badge = await prisma.badge.findUnique({
      where: { id: parseInt(badgeId) },
    });

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge tidak ditemukan',
      });
    }

    // Cek apakah user sudah memiliki badge ini
    const existingUserBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId: parseInt(userId),
          badgeId: parseInt(badgeId),
        },
      },
    });

    if (existingUserBadge) {
      return res.status(400).json({
        success: false,
        message: 'User sudah memiliki badge ini',
      });
    }

    // Berikan badge ke user
    const userBadge = await prisma.userBadge.create({
      data: {
        userId: parseInt(userId),
        badgeId: parseInt(badgeId),
      },
      include: {
        badge: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Update badges earned count di profile
    await prisma.profile.update({
      where: { userId: parseInt(userId) },
      data: {
        badgesEarned: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Badge berhasil diberikan ke user',
      data: userBadge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const revokeBadgeFromUser = async (req, res) => {
  try {
    const { userId, badgeId } = req.params;

    // Cek apakah user badge ada
    const userBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId: parseInt(userId),
          badgeId: parseInt(badgeId),
        },
      },
    });

    if (!userBadge) {
      return res.status(404).json({
        success: false,
        message: 'User tidak memiliki badge ini',
      });
    }

    // Hapus badge dari user
    await prisma.userBadge.delete({
      where: {
        userId_badgeId: {
          userId: parseInt(userId),
          badgeId: parseInt(badgeId),
        },
      },
    });

    // Update badges earned count di profile
    await prisma.profile.update({
      where: { userId: parseInt(userId) },
      data: {
        badgesEarned: {
          decrement: 1,
        },
      },
    });

    res.json({
      success: true,
      message: 'Badge berhasil dicabut dari user',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllBadges,
  getBadgeById,
  createBadge,
  updateBadge,
  deleteBadge,
  getUserBadges,
  awardBadgeToUser,
  revokeBadgeFromUser,
};
