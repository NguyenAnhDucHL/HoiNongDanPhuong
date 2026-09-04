const db = require('../config/database');
const asyncHandler = require('../middlewares/asyncHandler');

const getSettings = asyncHandler(async (req, res) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT key, value FROM settings', (err, rows) => {
      if (err) return reject(err);
      const settings = rows.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
      res.json(settings);
      resolve();
    });
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
  }

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      
      for (const [key, value] of Object.entries(settings)) {
        stmt.run(key, String(value));
      }
      
      stmt.finalize();
      db.run('COMMIT', (err) => {
        if (err) {
          db.run('ROLLBACK');
          return reject(err);
        }
        res.json({ message: 'Cập nhật cấu hình thành công' });
        resolve();
      });
    });
  });
});

module.exports = { getSettings, updateSettings };
