import React from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Hủy', isAlert = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] animate-[fadeIn_0.2s_ease]">
      <div className="bg-white rounded-[12px] p-[24px] w-[90%] max-w-[400px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] animate-[slideUp_0.2s_ease]">
        <h3 className="m-0 mb-[12px] text-[18px] text-[#333] font-bold">{title}</h3>
        <p className="m-0 mb-[24px] text-[#666] text-[15px] leading-[1.5]">{message}</p>
        <div className="flex justify-end gap-[12px]">
          {!isAlert && (
            <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-[16px] py-[8px] rounded-[8px] font-medium transition-colors" onClick={onCancel}>{cancelText}</button>
          )}
          <button className={`px-[16px] py-[8px] rounded-[8px] font-medium transition-colors shadow-sm text-white ${isAlert ? 'bg-[#0a8c24] hover:bg-[#07701c]' : 'bg-[#ef4444] hover:bg-[#dc2626]'}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
