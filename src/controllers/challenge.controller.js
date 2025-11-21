const prisma = require('../config/prisma');

const getAllChallenges = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, difficulty, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(category && { category }),
      ...(difficulty && { difficulty }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    const [challenges, total] = await Promise.all([
      prisma.challenge.findMany({
        where,
        skip,
        take,
        orderBy: { points: 'asc' },
      }),
      prisma.challenge.count({ where }),
    ]);

    res.json({
      success: true,
      data: challenges,
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

const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(id) },
      include: {
        userCompleteChallenges: {
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

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge tidak ditemukan',
      });
    }

    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createChallenge = async (req, res) => {
  try {
    const { title, description, category, difficulty, points, requirements } = req.body;

    // Validasi input
    if (!title || !description || !category || !difficulty || !requirements) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: title, description, category, difficulty, requirements',
      });
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        category,
        difficulty,
        points: points || 0,
        requirements,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Challenge berhasil ditambahkan',
      data: challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty, points, requirements } = req.body;

    // Cek apakah challenge ada
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingChallenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge tidak ditemukan',
      });
    }

    const challenge = await prisma.challenge.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(points !== undefined && { points }),
        ...(requirements && { requirements }),
      },
    });

    res.json({
      success: true,
      message: 'Challenge berhasil diupdate',
      data: challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah challenge ada
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingChallenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge tidak ditemukan',
      });
    }

    await prisma.challenge.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Challenge berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserChallenges = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userChallenges = await prisma.userCompleteChallenge.findMany({
      where: { userId },
      include: {
        challenge: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    res.json({
      success: true,
      data: userChallenges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const completeChallenge = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { challengeId } = req.body;

    if (!challengeId) {
      return res.status(400).json({
        success: false,
        message: 'challengeId wajib diisi',
      });
    }

    // Cek apakah challenge ada
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId) },
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge tidak ditemukan',
      });
    }

    // Cek apakah user sudah menyelesaikan challenge ini
    const existingCompletion = await prisma.userCompleteChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: parseInt(challengeId),
        },
      },
    });

    if (existingCompletion) {
      return res.status(400).json({
        success: false,
        message: 'Challenge sudah diselesaikan sebelumnya',
      });
    }

    // Tandai challenge sebagai selesai
    const userChallenge = await prisma.userCompleteChallenge.create({
      data: {
        userId,
        challengeId: parseInt(challengeId),
      },
      include: {
        challenge: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Challenge berhasil diselesaikan',
      data: userChallenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const markChallengeComplete = async (req, res) => {
  try {
    const { userId, challengeId } = req.body;

    if (!userId || !challengeId) {
      return res.status(400).json({
        success: false,
        message: 'userId dan challengeId wajib diisi',
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

    // Cek apakah challenge ada
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId) },
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge tidak ditemukan',
      });
    }

    // Cek apakah sudah diselesaikan
    const existingCompletion = await prisma.userCompleteChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: parseInt(userId),
          challengeId: parseInt(challengeId),
        },
      },
    });

    if (existingCompletion) {
      return res.status(400).json({
        success: false,
        message: 'User sudah menyelesaikan challenge ini',
      });
    }

    // Tandai challenge sebagai selesai
    const userChallenge = await prisma.userCompleteChallenge.create({
      data: {
        userId: parseInt(userId),
        challengeId: parseInt(challengeId),
      },
      include: {
        challenge: true,
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
      message: 'Challenge berhasil ditandai selesai untuk user',
      data: userChallenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const revokeChallengeCompletion = async (req, res) => {
  try {
    const { userId, challengeId } = req.params;

    // Cek apakah completion ada
    const completion = await prisma.userCompleteChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: parseInt(userId),
          challengeId: parseInt(challengeId),
        },
      },
    });

    if (!completion) {
      return res.status(404).json({
        success: false,
        message: 'User belum menyelesaikan challenge ini',
      });
    }

    // Hapus completion
    await prisma.userCompleteChallenge.delete({
      where: {
        userId_challengeId: {
          userId: parseInt(userId),
          challengeId: parseInt(challengeId),
        },
      },
    });

    res.json({
      success: true,
      message: 'Challenge completion berhasil dicabut',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getUserChallenges,
  completeChallenge,
  markChallengeComplete,
  revokeChallengeCompletion,
};
