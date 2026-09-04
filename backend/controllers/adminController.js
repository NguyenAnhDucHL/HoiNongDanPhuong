const adminService = require('../services/adminService');
const asyncHandler = require('../middlewares/asyncHandler');

const getPetitions = asyncHandler(async (req, res) => {
  const { page, limit, status, category, ward, search } = req.query;
  const result = await adminService.getAdminPetitions({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    status,
    category,
    ward,
    search,
  });
  res.json(result);
});

const getPetitionDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const petition = await adminService.getPetitionById(parseInt(id));
    res.json(petition);
  } catch (err) {
    if (err.statusCode === 404) return res.status(404).json({ error: err.message });
    throw err;
  }
});

const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  if (!status) return res.status(400).json({ error: 'Trạng thái là bắt buộc.' });

  await adminService.updatePetitionStatus(parseInt(id), {
    status,
    adminNotes,
    adminId: req.admin.id,
  });

  res.json({ message: 'Cập nhật trạng thái thành công.' });
});

const deletePetition = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await adminService.deletePetition(parseInt(id));
  res.json({ message: 'Đã xóa phản ánh thành công.' });
});

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.json(stats);
});

module.exports = {
  getPetitions,
  getPetitionDetail,
  updateStatus,
  deletePetition,
  getDashboard,
};
