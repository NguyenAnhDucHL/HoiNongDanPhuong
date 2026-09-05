const db = require('../config/database');

const getWards = (req, res) => {
  db.all('SELECT * FROM wards ORDER BY id ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
};

const addWard = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.run('INSERT INTO wards (name) VALUES (?)', [name.trim()], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Khu phố đã tồn tại' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID, name: name.trim() });
  });
};

const updateWard = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.run('UPDATE wards SET name = ? WHERE id = ?', [name.trim(), id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Khu phố đã tồn tại' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'Ward not found' });
    res.json({ success: true });
  });
};

const deleteWard = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM wards WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Ward not found' });
    res.json({ success: true });
  });
};

module.exports = {
  getWards,
  addWard,
  updateWard,
  deleteWard,
};
