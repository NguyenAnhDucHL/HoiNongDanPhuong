const { getAsync, allAsync, runAsync } = require('../utils/db-promise');

/**
 * Get all petitions for admin with filters and pagination
 */
const getAdminPetitions = async ({ page = 1, limit = 20, status, category, ward, search } = {}) => {
  const offset = (page - 1) * limit;

  let conditions = [];
  let params = [];

  if (status && status !== 'all') {
    conditions.push('status = ?');
    params.push(status);
  }
  if (category && category !== 'all') {
    conditions.push('category = ?');
    params.push(category);
  }
  if (ward && ward !== 'all') {
    conditions.push('ward = ?');
    params.push(ward);
  }
  if (search) {
    conditions.push('(fullName LIKE ? OR title LIKE ? OR trackingCode LIKE ? OR phone LIKE ?)');
    const q = `%${search}%`;
    params.push(q, q, q, q);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRow = await getAsync(
    `SELECT COUNT(*) as total FROM petitions ${whereClause}`,
    params
  );

  const rows = await allAsync(
    `SELECT id, fullName, phone, ward, title, category, status, trackingCode,
            aiPriority, aiSummary, imagePaths, createdAt, updatedAt
     FROM petitions ${whereClause}
     ORDER BY 
       CASE aiPriority WHEN 'cao' THEN 1 WHEN 'trung bình' THEN 2 WHEN 'thấp' THEN 3 ELSE 4 END,
       createdAt DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    data: rows || [],
    total: countRow?.total || 0,
    page,
    limit,
  };
};

/**
 * Get single petition detail for admin
 */
const getPetitionById = async (id) => {
  const petition = await getAsync(
    `SELECT id, fullName, phone, cccd, ward, address, title, category, content, imagePaths, status, trackingCode, adminNotes, aiSummary, aiPriority, aiSuggestion, aiCategory, createdAt, updatedAt FROM petitions WHERE id = ?`,
    [id]
  );

  if (!petition) {
    const err = new Error('Không tìm thấy phản ánh.');
    err.statusCode = 404;
    throw err;
  }

  const logs = await allAsync(
    `SELECT action, notes, createdAt FROM tracking_logs 
     WHERE petitionId = ? ORDER BY createdAt ASC`,
    [id]
  );

  petition.logs = logs || [];
  return petition;
};

/**
 * Update petition status and add tracking log
 */
const updatePetitionStatus = async (id, { status, adminNotes, adminId }) => {
  const validStatuses = ['pending', 'processing', 'resolved', 'rejected'];
  if (!validStatuses.includes(status)) {
    const err = new Error('Trạng thái không hợp lệ.');
    err.statusCode = 400;
    throw err;
  }

  await runAsync(
    `UPDATE petitions 
     SET status = ?, adminNotes = ?, updatedAt = ?
     WHERE id = ?`,
    [status, adminNotes || null, new Date().toISOString(), id]
  );

  const actionLabels = {
    pending: 'Chuyển về Chờ xử lý',
    processing: 'Đang xử lý',
    resolved: 'Đã giải quyết',
    rejected: 'Từ chối',
  };

  await runAsync(
    `INSERT INTO tracking_logs (petitionId, action, notes, adminId) VALUES (?, ?, ?, ?)`,
    [id, actionLabels[status], adminNotes || null, adminId]
  );

  return { success: true };
};

/**
 * Update AI analysis results for a petition
 */
const updateAIAnalysis = async (id, { aiSummary, aiPriority, aiSuggestion, aiCategory }) => {
  await runAsync(
    `UPDATE petitions 
     SET aiSummary = ?, aiPriority = ?, aiSuggestion = ?, aiCategory = ?, updatedAt = ?
     WHERE id = ?`,
    [aiSummary, aiPriority, aiSuggestion, aiCategory, new Date().toISOString(), id]
  );
  return { success: true };
};

/**
 * Delete a petition (admin only)
 */
const deletePetition = async (id) => {
  await runAsync(`DELETE FROM tracking_logs WHERE petitionId = ?`, [id]);
  await runAsync(`DELETE FROM petitions WHERE id = ?`, [id]);
  return { success: true };
};

/**
 * Get dashboard statistics for admin
 */
const getDashboardStats = async () => {
  const overview = await getAsync(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
      SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
      SUM(CASE WHEN aiPriority = 'cao' THEN 1 ELSE 0 END) as highPriority,
      SUM(CASE WHEN date(createdAt) = date('now') THEN 1 ELSE 0 END) as today
    FROM petitions
  `);

  const byCategory = await allAsync(`
    SELECT category, COUNT(*) as count
    FROM petitions
    GROUP BY category
    ORDER BY count DESC
  `);

  const byWard = await allAsync(`
    SELECT ward, COUNT(*) as count
    FROM petitions
    GROUP BY ward
    ORDER BY count DESC
    LIMIT 10
  `);

  const recentPetitions = await allAsync(`
    SELECT id, fullName, title, category, status, aiPriority, trackingCode, createdAt
    FROM petitions
    ORDER BY createdAt DESC
    LIMIT 5
  `);

  return {
    overview: overview || {},
    byCategory: byCategory || [],
    byWard: byWard || [],
    recentPetitions: recentPetitions || [],
  };
};

module.exports = {
  getAdminPetitions,
  getPetitionById,
  updatePetitionStatus,
  updateAIAnalysis,
  deletePetition,
  getDashboardStats,
};
