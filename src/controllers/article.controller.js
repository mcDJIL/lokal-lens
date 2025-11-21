const prisma = require('../config/prisma');

const getAllArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      province,
      isHighlight,
      authorId,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search } },
          { excerpt: { contains: search } },
          { content: { contains: search } },
        ],
      }),
      ...(category && { category }),
      ...(province && { province }),
      ...(isHighlight !== undefined && { isHighlight: isHighlight === 'true' }),
      ...(authorId && { authorId: parseInt(authorId) }),
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              email: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
              bookmarks: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      success: true,
      data: articles,
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

const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile: {
              select: {
                avatar: true,
                bio: true,
              },
            },
          },
        },
        comments: {
          where: { parentId: null },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    profile: {
                      select: {
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan',
      });
    }

    // Increment views
    await prisma.article.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } },
    });

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile: {
              select: {
                avatar: true,
                bio: true,
              },
            },
          },
        },
        comments: {
          where: { parentId: null },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    profile: {
                      select: {
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan',
      });
    }

    // Increment views
    await prisma.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createArticle = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      province,
      readTime,
      isHighlight,
    } = req.body;

    // Validasi input
    if (!title || !slug || !excerpt || !content || !featuredImage || !category) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: title, slug, excerpt, content, featuredImage, category',
      });
    }

    // Cek apakah slug sudah ada
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return res.status(400).json({
        success: false,
        message: 'Slug sudah digunakan',
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        authorId,
        category,
        tags,
        province,
        readTime: readTime || 5,
        isHighlight: isHighlight || false,
      },
      include: {
        author: {
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
      message: 'Artikel berhasil ditambahkan',
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      province,
      readTime,
      isHighlight,
    } = req.body;

    // Cek apakah article ada
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan',
      });
    }

    // Cek authorization: hanya author atau admin yang bisa update
    if (existingArticle.authorId !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengupdate artikel ini',
      });
    }

    // Cek apakah slug sudah digunakan oleh article lain
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Slug sudah digunakan',
        });
      }
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(featuredImage && { featuredImage }),
        ...(category && { category }),
        ...(tags !== undefined && { tags }),
        ...(province !== undefined && { province }),
        ...(readTime !== undefined && { readTime }),
        ...(isHighlight !== undefined && { isHighlight }),
      },
      include: {
        author: {
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
      message: 'Artikel berhasil diupdate',
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Cek apakah article ada
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan',
      });
    }

    // Cek authorization: hanya author atau admin yang bisa delete
    if (existingArticle.authorId !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus artikel ini',
      });
    }

    await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Artikel berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyArticles = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { authorId },
        skip,
        take,
        include: {
          _count: {
            select: {
              comments: true,
              bookmarks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.article.count({ where: { authorId } }),
    ]);

    res.json({
      success: true,
      data: articles,
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

const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'articleId wajib diisi',
      });
    }

    // Cek apakah article ada
    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan',
      });
    }

    // Cek apakah sudah bookmark
    const existingBookmark = await prisma.userArticleBookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: parseInt(articleId),
        },
      },
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.userArticleBookmark.delete({
        where: {
          userId_articleId: {
            userId,
            articleId: parseInt(articleId),
          },
        },
      });

      return res.json({
        success: true,
        message: 'Bookmark dihapus',
        bookmarked: false,
      });
    } else {
      // Add bookmark
      await prisma.userArticleBookmark.create({
        data: {
          userId,
          articleId: parseInt(articleId),
        },
      });

      return res.json({
        success: true,
        message: 'Artikel berhasil di-bookmark',
        bookmarked: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyBookmarks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [bookmarks, total] = await Promise.all([
      prisma.userArticleBookmark.findMany({
        where: { userId },
        skip,
        take,
        include: {
          article: {
            include: {
              author: {
                select: {
                  id: true,
                  fullName: true,
                  profile: {
                    select: {
                      avatar: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  comments: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.userArticleBookmark.count({ where: { userId } }),
    ]);

    res.json({
      success: true,
      data: bookmarks,
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

module.exports = {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles,
  toggleBookmark,
  getMyBookmarks,
};
