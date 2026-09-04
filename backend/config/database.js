const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const DB_FILE = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(DB_FILE);

const WARDS = [
  'Khu phố 1', 'Khu phố 2', 'Khu phố 3', 'Khu phố 4', 'Khu phố 5',
  'Khu phố 6', 'Khu phố 7', 'Khu phố 8', 'Khu phố 9', 'Khu phố 10',
  'Khu phố 11', 'Khu phố 12', 'Khu phố 13', 'Khu phố 14', 'Khu phố 15',
];

const initDB = () => {
  db.run('PRAGMA journal_mode = WAL;');
  db.serialize(() => {
    // 1. Admins table
    db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fullName TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Petitions table - extended for HND with AI fields
    db.run(`
      CREATE TABLE IF NOT EXISTS petitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        phone TEXT,
        cccd TEXT,
        ward TEXT,
        address TEXT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        imagePaths TEXT,
        status TEXT DEFAULT 'pending',
        trackingCode TEXT UNIQUE,
        adminNotes TEXT,
        aiSummary TEXT,
        aiPriority TEXT,
        aiSuggestion TEXT,
        aiCategory TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Handle migrations for older tables
    db.run(`ALTER TABLE petitions ADD COLUMN aiSummary TEXT`, () => { });
    db.run(`ALTER TABLE petitions ADD COLUMN aiPriority TEXT`, () => { });
    db.run(`ALTER TABLE petitions ADD COLUMN aiSuggestion TEXT`, () => { });
    db.run(`ALTER TABLE petitions ADD COLUMN aiCategory TEXT`, () => { });
    db.run(`ALTER TABLE petitions ADD COLUMN updatedAt DATETIME`, () => { });

    // 3. Tracking logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS tracking_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        petitionId INTEGER NOT NULL,
        action TEXT NOT NULL,
        notes TEXT,
        adminId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(petitionId) REFERENCES petitions(id)
      )
    `);

    // 4. Wards table
    db.run(`
      CREATE TABLE IF NOT EXISTS wards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      )
    `, (err) => {
      if (!err) {
        db.get('SELECT COUNT(*) as count FROM wards', (err, row) => {
          if (!err && row && row.count === 0) {
            const stmt = db.prepare('INSERT OR IGNORE INTO wards (name) VALUES (?)');
            WARDS.forEach(name => stmt.run(name));
            stmt.finalize();
          }
        });
      }
    });

    // 5. Posts table (for News and Guides)
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Settings table
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    // 7. Performance indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_petitions_createdAt ON petitions (createdAt DESC)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_petitions_status ON petitions (status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_petitions_ward ON petitions (ward)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_petitions_category ON petitions (category)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_petitions_trackingCode ON petitions (trackingCode)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_tracking_logs_petitionId ON tracking_logs (petitionId)`);

    // 6. Default admin account
    db.get(`SELECT id FROM admins WHERE username = 'admin'`, async (err, row) => {
      if (!row) {
        try {
          const hashed = await bcrypt.hash('hnd2026', 10);
          db.run(
            `INSERT INTO admins (username, password, fullName) VALUES (?, ?, ?)`,
            ['admin', hashed, 'Quản trị viên HND']
          );
          console.log('[DB] Default admin created: admin / hnd2026');
        } catch (e) {
          console.error('[DB] Error creating admin:', e);
        }
      }
    });

    console.log('[DB] Database initialized successfully.');
  });
};

initDB();

module.exports = db;
