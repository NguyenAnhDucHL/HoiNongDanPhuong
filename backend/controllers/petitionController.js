const petitionService = require('../services/petitionService');
const asyncHandler = require('../middlewares/asyncHandler');

const createPetition = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const imagePaths = files.map(f => f.filename).join(',');

  const { fullName, phone, cccd, ward, address, title, category, content } = req.body;

  // Basic validation
  if (!fullName?.trim()) return res.status(400).json({ error: 'Họ tên là bắt buộc.' });
  if (!title?.trim()) return res.status(400).json({ error: 'Tiêu đề là bắt buộc.' });
  if (!category) return res.status(400).json({ error: 'Lĩnh vực là bắt buộc.' });
  if (!content?.trim()) return res.status(400).json({ error: 'Nội dung phản ánh là bắt buộc.' });
  if (content.trim().length < 20) return res.status(400).json({ error: 'Nội dung phản ánh quá ngắn (tối thiểu 20 ký tự).' });

  const result = await petitionService.createPetition({
    fullName, phone, cccd, ward, address, title, category, content, imagePaths,
  });

  res.status(201).json({
    message: 'Phản ánh đã được tiếp nhận thành công!',
    trackingCode: result.trackingCode,
    id: result.id,
  });
});

const getPublicPetitions = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
  const result = await petitionService.getPublicPetitions(page, limit);
  res.json(result);
});

const trackPetition = asyncHandler(async (req, res) => {
  const { code } = req.params;
  if (!code) return res.status(400).json({ error: 'Mã tra cứu là bắt buộc.' });

  try {
    const petition = await petitionService.trackPetition(code.trim().toUpperCase());
    res.json(petition);
  } catch (err) {
    if (err.statusCode === 404) return res.status(404).json({ error: err.message });
    throw err;
  }
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await petitionService.getStats();
  res.json(stats);
});

const recordVisit = asyncHandler(async (req, res) => {
  await petitionService.recordVisit();
  res.json({ success: true });
});

const getWards = asyncHandler(async (req, res) => {
  const wards = await petitionService.getWards();
  res.json(wards);
});

module.exports = {
  createPetition,
  getPublicPetitions,
  trackPetition,
  getStats,
  getWards,
  recordVisit,
};
