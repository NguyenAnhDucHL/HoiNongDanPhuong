import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import AIAssistant from '../components/ui/AIAssistant';
import PostManager from '../features/admin/components/PostManager';
import SettingsManager from '../features/admin/components/SettingsManager';
import CategoryManager from '../features/admin/components/CategoryManager';
import WardManager from '../features/admin/components/WardManager';
import AccountManager from '../features/admin/components/AccountManager';

import AdminSidebar from '../features/admin/components/AdminSidebar';
import AdminOverview from '../features/admin/components/AdminOverview';
import AdminPetitions from '../features/admin/components/AdminPetitions';
import PetitionDetailModal from '../features/admin/components/PetitionDetailModal';
import ConfirmModal from '../components/ui/ConfirmModal';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: '⏳ Chờ xử lý' },
  { value: 'processing', label: '🔄 Đang xử lý' },
  { value: 'resolved', label: '✅ Đã giải quyết' },
  { value: 'rejected', label: '❌ Từ chối' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminInfo] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hnd_admin_info') || '{}'); } catch { return {}; }
  });

  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingList, setLoadingList] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Detail modal
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');

  const LIMIT = 10;

  const [categories, setCategories] = useState(['all']);

  const logout = () => {
    localStorage.removeItem('hnd_admin_token');
    localStorage.removeItem('hnd_admin_info');
    navigate('/admin/login?logout=success');
  };

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchApi('/categories');
      setCategories(['all', ...res.map(c => c.name)]);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetchApi('/admin/dashboard');
      setStats(res);
    } catch (e) {
      if (e.status === 401 || e.status === 403) logout();
    }
  }, []);

  const loadPetitions = useCallback(async () => {
    setLoadingList(true);
    try {
      const params = new URLSearchParams({
        page, limit: LIMIT,
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterCategory !== 'all' && { category: filterCategory }),
        ...(search && { search }),
      });
      const res = await fetchApi(`/admin/petitions?${params}`);
      setPetitions(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      if (e.status === 401 || e.status === 403) logout();
    } finally {
      setLoadingList(false);
    }
  }, [page, filterStatus, filterCategory, search]);

  useEffect(() => {
    document.body.classList.add('admin-mode');
    loadDashboard();
    loadCategories();
    return () => {
      document.body.classList.remove('admin-mode');
    };
  }, []);

  useEffect(() => {
    if (tab === 'petitions') loadPetitions();
  }, [tab, loadPetitions]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    setAiResult(null);
    try {
      const p = await fetchApi(`/admin/petitions/${id}`);
      setSelectedPetition(p);
      setUpdateStatus(p.status);
      setAdminNotes(p.adminNotes || '');
    } catch (e) {
      setAlertMsg('Không thể tải chi tiết.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedPetition) return;
    setUpdating(true);
    try {
      await fetchApi(`/admin/petitions/${selectedPetition.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: updateStatus, adminNotes }),
      });
      setSelectedPetition(prev => ({ ...prev, status: updateStatus, adminNotes }));
      loadPetitions();
      if (tab === 'dashboard') loadDashboard();
      setAlertMsg('✅ Cập nhật thành công!');
    } catch (e) {
      setAlertMsg('❌ Lỗi: ' + e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!selectedPetition) return;
    setAnalyzingAI(true);
    setAiResult(null);
    try {
      const res = await fetchApi(`/ai/analyze/${selectedPetition.id}`, { method: 'POST' });
      setAiResult(res.analysis);
      setSelectedPetition(prev => ({
        ...prev,
        aiSummary: res.analysis.summary,
        aiPriority: res.analysis.priority,
        aiSuggestion: res.analysis.suggestion,
        aiCategory: res.analysis.category,
      }));
      loadPetitions();
    } catch (e) {
      setAlertMsg('❌ AI lỗi: ' + e.message);
    } finally {
      setAnalyzingAI(false);
    }
  };

  const handleDeletePetition = async (id) => {
    setDeleteId(id);
  };

  const confirmDeletePetition = async () => {
    if (!deleteId) return;
    try {
      await fetchApi(`/admin/petitions/${deleteId}`, { method: 'DELETE' });
      if (selectedPetition && selectedPetition.id === deleteId) {
        setSelectedPetition(null);
      }
      loadPetitions();
      if (tab === 'dashboard') loadDashboard();
      setDeleteId(null);
    } catch (e) {
      setAlertMsg('❌ Lỗi xóa: ' + e.message);
      setDeleteId(null);
    }
  };

  const getTabTitle = () => {
    switch (tab) {
      case 'dashboard': return 'Tổng quan';
      case 'petitions': return 'Danh sách phản ánh';
      case 'categories': return 'Quản lý Lĩnh vực';
      case 'wards': return 'Quản lý Khu phố';
      case 'news': return 'Quản lý Tin tức';
      case 'guides': return 'Quản lý Hướng dẫn';
      case 'settings': return 'Cài đặt hệ thống';
      default: return '';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7f6]">
      {/* Sidebar */}
      <AdminSidebar currentTab={tab} onTabChange={(t) => { setTab(t); setSidebarOpen(false); }} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-[64px] bg-white flex items-center justify-between px-[24px] border-b border-[#e2e8f0] shadow-sm z-[90]">
          <div className="flex items-center gap-[16px]">
            <button className="md:hidden bg-transparent border-none text-[24px] cursor-pointer text-[#2d3748] p-0 mr-[12px]" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <h1 className="text-[18px] font-semibold text-[#2d3748] m-0">{getTabTitle()}</h1>
          </div>
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[32px] h-[32px] bg-[#e6f4ea] text-[#0a8c24] rounded-full flex items-center justify-center font-semibold text-[14px]">
                {adminInfo.fullName ? adminInfo.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                {adminInfo.fullName || adminInfo.username}
              </span>
            </div>
            <div className="w-[1px] h-[24px] bg-[#e2e8f0]"></div>
            <a href="/" target="_blank" rel="noreferrer" className="text-[#0a8c24] text-[13px] no-underline font-medium hover:opacity-80 transition-opacity">
              <span className="hidden md:inline">Mở trang chủ ↗</span>
              <span className="md:hidden">🏠</span>
            </a>
            <button className="bg-transparent border border-[#e2e8f0] text-[#718096] px-[10px] md:px-[14px] py-[6px] rounded-[6px] text-[13px] flex items-center gap-[6px] transition-all hover:bg-[#fee2e2] hover:text-[#dc2626] hover:border-[#fca5a5]" onClick={logout}>
              🚪 <span className="hidden md:inline">Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto bg-[#f4f7f6]">
          {tab === 'dashboard' && (
            <AdminOverview
              stats={stats}
              onNavigateToPetitions={() => setTab('petitions')}
              onOpenDetail={openDetail}
            />
          )}

          {tab === 'petitions' && (
            <AdminPetitions
              petitions={petitions}
              total={total}
              page={page}
              totalPages={Math.ceil(total / LIMIT)}
              setPage={setPage}
              loadingList={loadingList}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              setSearch={setSearch}
              statusOptions={STATUS_OPTIONS}
              categories={categories}
              onOpenDetail={openDetail}
            />
          )}

          {tab === 'news' && (
            <div className="flex-1 overflow-y-auto p-[24px]">
              <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[24px]">
                <PostManager type="news" title="Tin tức" />
              </div>
            </div>
          )}

          {tab === 'categories' && (
            <div className="flex-1 overflow-y-auto p-[24px]">
              <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[24px]">
                <CategoryManager />
              </div>
            </div>
          )}

          {tab === 'wards' && (
            <div className="flex-1 overflow-y-auto p-[24px]">
              <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[24px]">
                <WardManager />
              </div>
            </div>
          )}

          {tab === 'guides' && (
            <div className="flex-1 overflow-y-auto p-[24px]">
              <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[24px]">
                <PostManager type="guide" title="Hướng dẫn" />
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-[24px]">
              <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[24px]">
                <SettingsManager />
              </div>
            </div>
          )}

          {tab === 'account' && (
            <div className="flex-1 overflow-y-auto p-[24px]">
              <AccountManager />
            </div>
          )}
        </div>
      </div>

      {/* Petition Detail Modal */}
      <PetitionDetailModal
        selectedPetition={selectedPetition}
        setSelectedPetition={setSelectedPetition}
        detailLoading={detailLoading}
        updateStatus={updateStatus}
        setUpdateStatus={setUpdateStatus}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        updating={updating}
        handleUpdateStatus={handleUpdateStatus}
        handleDeletePetition={handleDeletePetition}
        handleAIAnalyze={handleAIAnalyze}
        analyzingAI={analyzingAI}
      />

      {/* AI Floating Button */}
      <AIAssistant />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa phản ánh này không? Hành động này không thể hoàn tác."
        onConfirm={confirmDeletePetition}
        onCancel={() => setDeleteId(null)}
        confirmText="Xóa"
      />

      <ConfirmModal
        isOpen={!!alertMsg}
        title="Thông báo"
        message={alertMsg}
        onConfirm={() => setAlertMsg('')}
        isAlert={true}
      />
    </div>
  );
}
