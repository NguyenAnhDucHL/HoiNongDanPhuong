const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DB_FILE = path.join(__dirname, '../database.sqlite');
const BACKUP_DIR = path.join(__dirname, '../backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// Chạy lúc 3:00 AM mỗi ngày
cron.schedule('0 3 * * *', () => {
  const dateStr = new Date().toISOString().split('T')[0];
  const backupFile = path.join(BACKUP_DIR, `database_backup_${dateStr}.sqlite.gz`);

  console.log(`[Backup] Bắt đầu sao lưu database sang: ${backupFile}`);

  const readStream = fs.createReadStream(DB_FILE);
  const writeStream = fs.createWriteStream(backupFile);
  const gzip = zlib.createGzip();

  readStream.pipe(gzip).pipe(writeStream)
    .on('finish', () => {
      console.log(`[Backup] Sao lưu thành công: ${backupFile}`);
      cleanOldBackups();
    })
    .on('error', (err) => {
      console.error(`[Backup] Lỗi sao lưu:`, err);
    });
});

function cleanOldBackups() {
  const MAX_AGE_DAYS = 30;
  const now = Date.now();

  fs.readdir(BACKUP_DIR, (err, files) => {
    if (err) return console.error('[Backup] Lỗi đọc thư mục backup:', err);

    files.forEach(file => {
      if (!file.startsWith('database_backup_')) return;
      const filePath = path.join(BACKUP_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        const daysOld = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
        if (daysOld > MAX_AGE_DAYS) {
          fs.unlink(filePath, err => {
            if (!err) console.log(`[Backup] Đã xóa bản sao lưu cũ: ${file}`);
          });
        }
      });
    });
  });
}

console.log('[Backup] Dịch vụ sao lưu tự động đã được kích hoạt (3:00 AM hàng ngày).');
