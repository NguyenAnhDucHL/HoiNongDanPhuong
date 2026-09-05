const db = require('../config/database');
const asyncHandler = require('../middlewares/asyncHandler');
const fs = require('fs');
const path = require('path');

const getPosts = asyncHandler(async (req, res) => {
  const type = req.query.type; // 'news' or 'guide'
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  let query = 'SELECT id, type, title, image, images, createdAt, updatedAt FROM posts';
  const params = [];
  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }
  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const countQuery = type ? 'SELECT COUNT(*) as count FROM posts WHERE type = ?' : 'SELECT COUNT(*) as count FROM posts';
  const countParams = type ? [type] : [];

  return new Promise((resolve, reject) => {
    db.get(countQuery, countParams, (err, countRow) => {
      if (err) return reject(err);

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        res.json({
          data: rows,
          total: countRow.count,
          page,
          limit
        });
        resolve();
      });
    });
  });
});

const getPostById = asyncHandler(async (req, res) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, type, title, content, image, images, createdAt, updatedAt FROM posts WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return reject(err);
      if (!row) {
        const error = new Error('Không tìm thấy bài viết');
        error.status = 404;
        return reject(error);
      }
      res.json(row);
      resolve();
    });
  });
});

const createPost = asyncHandler(async (req, res) => {
  const { type, title, content } = req.body;
  const newImages = req.files ? req.files.map(f => f.filename) : [];

  if (!type || !title || !content) {
    return res.status(400).json({ error: 'Vui lòng nhập đủ type, title, content' });
  }

  const imagesStr = JSON.stringify(newImages);

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO posts (type, title, content, images) VALUES (?, ?, ?, ?)',
      [type, title, content, imagesStr],
      function (err) {
        if (err) return reject(err);
        res.status(201).json({ message: 'Tạo bài viết thành công', id: this.lastID });
        resolve();
      }
    );
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const { type, title, content, existingImages } = req.body;
  const newImages = req.files ? req.files.map(f => f.filename) : [];

  if (!type || !title || !content) {
    return res.status(400).json({ error: 'Vui lòng nhập đủ type, title, content' });
  }

  let parsedExistingImages = [];
  try {
    if (existingImages) parsedExistingImages = JSON.parse(existingImages);
  } catch (e) {
    console.error('Error parsing existingImages', e);
  }

  const finalImages = [...parsedExistingImages, ...newImages];
  const imagesStr = JSON.stringify(finalImages);

  return new Promise((resolve, reject) => {
    db.get('SELECT images FROM posts WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return reject(err);
      if (!row) {
        const error = new Error('Không tìm thấy bài viết');
        error.status = 404;
        return reject(error);
      }

      let oldImages = [];
      try {
        if (row.images) oldImages = JSON.parse(row.images);
      } catch (e) { }

      let query = 'UPDATE posts SET type = ?, title = ?, content = ?, images = ?, updatedAt = ? WHERE id = ?';
      const params = [type, title, content, imagesStr, new Date().toISOString(), req.params.id];

      db.run(query, params, function (err) {
        if (err) return reject(err);

        // Try deleting removed images
        oldImages.forEach(img => {
          if (!parsedExistingImages.includes(img)) {
            try {
              fs.unlinkSync(path.join(__dirname, '..', 'uploads', img));
            } catch (e) { }
          }
        });

        res.json({ message: 'Cập nhật thành công' });
        resolve();
      });
    });
  });
});

const deletePost = asyncHandler(async (req, res) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT image, images FROM posts WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return reject(err);
      if (!row) {
        const error = new Error('Không tìm thấy bài viết');
        error.status = 404;
        return reject(error);
      }

      db.run('DELETE FROM posts WHERE id = ?', [req.params.id], (err) => {
        if (err) return reject(err);

        // Delete images
        if (row.image) {
          try {
            fs.unlinkSync(path.join(__dirname, '..', 'uploads', row.image));
          } catch (e) { console.error('Error deleting old image:', e); }
        }
        if (row.images) {
          try {
            const parsed = JSON.parse(row.images);
            parsed.forEach(img => {
              try { fs.unlinkSync(path.join(__dirname, '..', 'uploads', img)); } catch (e) { }
            });
          } catch (e) { }
        }

        res.json({ message: 'Xóa thành công' });
        resolve();
      });
    });
  });
});

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
