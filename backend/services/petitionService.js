const { getAsync, allAsync, runAsync } = require('../utils/db-promise');

/**
 * Create a new petition from public form submission
 */
const createPetition = async (petitionData) => {
  const {
    fullName, phone, cccd, ward, address,
    title, category, content, imagePaths
  } = petitionData;

  // Generate unique tracking code: HND-YYMMDD-XXXX
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const trackingCode = `HND-${dateStr}-${randomStr}`;

  const result = await runAsync(
    `INSERT INTO petitions 
      (fullName, phone, cccd, ward, address, title, category, content, imagePaths, trackingCode)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fullName?.trim() || '',
      phone?.trim() || '',
      cccd?.trim() || '',
      ward || '',
      address?.trim() || '',
      title?.trim() || '',
      category || '',
      content?.trim() || '',
      imagePaths || '',
      trackingCode
    ]
  );

  // Create initial tracking log
  await runAsync(
    `INSERT INTO tracking_logs (petitionId, action, notes) VALUES (?, ?, ?)`,
    [result.lastID, 'submitted', 'Phản ánh đã được tiếp nhận thành công.']
  );

  return { id: result.lastID, trackingCode };
};

/**
 * Get public petitions list (paginated)
 */
const getPublicPetitions = async (page = 1, limit = 9) => {
  const offset = (page - 1) * limit;

  const countRow = await getAsync('SELECT COUNT(*) as total FROM petitions');
  const rows = await allAsync(
    `SELECT id, fullName, title, category, status, aiPriority, createdAt
     FROM petitions 
     ORDER BY createdAt DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return {
    data: rows || [],
    total: countRow?.total || 0,
    page,
    limit,
  };
};

/**
 * Track a petition by tracking code (public)
 */
const trackPetition = async (trackingCode) => {
  const petition = await getAsync(
    `SELECT id, fullName, title, category, status, trackingCode, adminNotes,
            aiSummary, aiPriority, aiSuggestion, createdAt, updatedAt
     FROM petitions WHERE trackingCode = ?`,
    [trackingCode.toUpperCase()]
  );

  if (!petition) {
    const err = new Error('Không tìm thấy mã tra cứu này.');
    err.statusCode = 404;
    throw err;
  }

  const logs = await allAsync(
    `SELECT action, notes, createdAt FROM tracking_logs 
     WHERE petitionId = ? ORDER BY createdAt DESC`,
    [petition.id]
  );

  petition.logs = logs || [];
  return petition;
};

/**
 * Get stats for the homepage
 */
const getStats = async () => {
  const stats = await getAsync(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
      SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM petitions
  `);

  return {
    total: stats?.total || 0,
    resolved: stats?.resolved || 0,
    processing: stats?.processing || 0,
    pending: stats?.pending || 0,
    rejected: stats?.rejected || 0,
  };
};

/**
 * Get all wards
 */
const getWards = async () => {
  return await allAsync('SELECT id, name FROM wards ORDER BY id ASC');
};

module.exports = {
  createPetition,
  getPublicPetitions,
  trackPetition,
  getStats,
  getWards,
};
