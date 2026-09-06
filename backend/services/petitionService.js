const { getAsync, allAsync, runAsync } = require('../utils/db-promise');
const aiService = require('./aiService');

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
      (fullName, phone, cccd, ward, address, title, category, content, imagePaths, trackingCode, aiSummary, aiPriority, aiSuggestion, aiCategory)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      trackingCode,
      '',
      '',
      '',
      ''
    ]
  );

  // Analyze petition with AI asynchronously in the background
  aiService.analyzePetition({ title, content })
    .then(async (analysis) => {
      await runAsync(
        `UPDATE petitions SET aiSummary = ?, aiPriority = ?, aiSuggestion = ?, aiCategory = ? WHERE id = ?`,
        [
          analysis.summary || '',
          analysis.priority || 'Thấp',
          analysis.suggestion || '',
          analysis.category || 'Khác',
          result.lastID
        ]
      );
    })
    .catch(err => {
      console.error('Background AI analysis failed:', err);
    });

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
 * Record a visit for today
 */
const recordVisit = async () => {
  const vnTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
  const dateStr = vnTime.toISOString().slice(0, 10);
  await runAsync(`
    INSERT INTO visits (date, count) VALUES (?, 1)
    ON CONFLICT(date) DO UPDATE SET count = count + 1
  `, [dateStr]);
};

/**
 * Get stats for the homepage
 */
const getStats = async () => {
  const vnTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
  const dateStr = vnTime.toISOString().slice(0, 10);
  const visitRow = await getAsync(`SELECT count FROM visits WHERE date = ?`, [dateStr]);
  const visitsToday = visitRow?.count || 0;

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
    visitsToday: visitsToday,
  };
};

module.exports = {
  createPetition,
  getPublicPetitions,
  trackPetition,
  getStats,
  recordVisit,
};
