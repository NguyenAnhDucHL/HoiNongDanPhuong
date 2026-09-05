const db = require('../config/database');

const getCategories = (req, res) => {
  db.all('SELECT * FROM categories ORDER BY id ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
};

const addCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.run('INSERT INTO categories (name) VALUES (?)', [name.trim()], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Lĩnh vực đã tồn tại' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID, name: name.trim() });
  });
};

const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.run('UPDATE categories SET name = ? WHERE id = ?', [name.trim(), id], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Lĩnh vực đã tồn tại' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  });
};

const deleteCategory = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM categories WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  });
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
