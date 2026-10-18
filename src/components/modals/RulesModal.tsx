'use client';

import { useState, useEffect } from 'react';
import { ScoringRules } from '@/lib/types/rules';
import { DEFAULT_RULES } from '@/lib/data/default-rules';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: ScoringRules;
  onSaveRules: (newRules: ScoringRules) => void;
}

export default function RulesModal({
  isOpen,
  onClose,
  rules,
  onSaveRules
}: RulesModalProps) {
  const [wCargo, setWCargo] = useState(rules.weightCargo);
  const [wRoute, setWRoute] = useState(rules.weightRoute);
  const [wVolume, setWVolume] = useState(rules.weightVolume);
  const [thA, setThA] = useState(rules.thresholdA);
  const [thB, setThB] = useState(rules.thresholdB);
  const [dataMasking, setDataMasking] = useState(rules.dataMasking);
  const [bulkText, setBulkText] = useState(rules.bulkKeywords.join(', '));
  const [projectText, setProjectText] = useState(rules.projectKeywords.join(', '));
  const [negText, setNegText] = useState(rules.negativeKeywords.join(', '));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setWCargo(rules.weightCargo);
    setWRoute(rules.weightRoute);
    setWVolume(rules.weightVolume);
    setThA(rules.thresholdA);
    setThB(rules.thresholdB);
    setDataMasking(rules.dataMasking);
    setBulkText(rules.bulkKeywords.join(', '));
    setProjectText(rules.projectKeywords.join(', '));
    setNegText(rules.negativeKeywords.join(', '));
    setErrorMsg(null);
  }, [rules, isOpen]);

  if (!isOpen) return null;

  const currentSum = (parseInt(String(wCargo), 10) || 0) +
                     (parseInt(String(wRoute), 10) || 0) +
                     (parseInt(String(wVolume), 10) || 0);

  const handleReset = () => {
    setWCargo(DEFAULT_RULES.weightCargo);
    setWRoute(DEFAULT_RULES.weightRoute);
    setWVolume(DEFAULT_RULES.weightVolume);
    setThA(DEFAULT_RULES.thresholdA);
    setThB(DEFAULT_RULES.thresholdB);
    setDataMasking(DEFAULT_RULES.dataMasking);
    setBulkText(DEFAULT_RULES.bulkKeywords.join(', '));
    setProjectText(DEFAULT_RULES.projectKeywords.join(', '));
    setNegText(DEFAULT_RULES.negativeKeywords.join(', '));
    setErrorMsg(null);
  };

  const handleSave = () => {
    if (currentSum !== 100) {
      setErrorMsg(`Tổng trọng số của 3 tiêu chí phải bằng 100% (Hiện tại đang là ${currentSum}%). Vui lòng điều chỉnh lại.`);
      return;
    }
    if (thB >= thA) {
      setErrorMsg('Ngưỡng điểm Nhóm B phải nhỏ hơn ngưỡng điểm Nhóm A.');
      return;
    }

    const newRules: ScoringRules = {
      weightCargo: wCargo,
      weightRoute: wRoute,
      weightVolume: wVolume,
      thresholdA: thA,
      thresholdB: thB,
      dataMasking,
      bulkKeywords: bulkText.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      projectKeywords: projectText.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      negativeKeywords: negText.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    };

    onSaveRules(newRules);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rulesModalTitle"
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-white border border-slate-300 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 id="rulesModalTitle" className="text-sm font-bold text-slate-900">
              Cấu hình Bộ tiêu chí, Trọng số &amp; Bảo mật Dữ liệu
            </h3>
            <p className="text-xs text-slate-500">
              Mọi thay đổi về trọng số và từ khóa sẽ tự động tính toán lại điểm số và lưu vào bộ nhớ phiên làm việc.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-1 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs overflow-y-auto">
          {/* Weights configuration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">
                1. Phân bổ Trọng số Chấm điểm (Tổng = 100%)
              </span>
              <span
                className={`font-mono font-semibold ${
                  currentSum === 100 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                Tổng: {currentSum}%
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200">
                <label htmlFor="inputWeightCargo" className="font-medium text-slate-700 block">
                  Độ khớp Mặt hàng (%)
                </label>
                <input
                  id="inputWeightCargo"
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={wCargo}
                  onChange={e => setWCargo(parseInt(e.target.value, 10) || 0)}
                  className="mt-1.5 w-full bg-white border border-slate-300 px-2.5 py-1.5 font-mono font-bold text-sm text-[#0F3D75] focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Than, clinker, xi măng, nông sản, thép, thiết bị dự án
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200">
                <label htmlFor="inputWeightRoute" className="font-medium text-slate-700 block">
                  Tuyến &amp; Cảng POL/POD (%)
                </label>
                <input
                  id="inputWeightRoute"
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={wRoute}
                  onChange={e => setWRoute(parseInt(e.target.value, 10) || 0)}
                  className="mt-1.5 w-full bg-white border border-slate-300 px-2.5 py-1.5 font-mono font-bold text-sm text-[#0F3D75] focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Đông Nam Á, Đông Á, Nam Á (Ấn Độ), Trung Đông, Nam Phi
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200">
                <label htmlFor="inputWeightVolume" className="font-medium text-slate-700 block">
                  Quy mô lô &amp; Cỡ tàu (%)
                </label>
                <input
                  id="inputWeightVolume"
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={wVolume}
                  onChange={e => setWVolume(parseInt(e.target.value, 10) || 0)}
                  className="mt-1.5 w-full bg-white border border-slate-300 px-2.5 py-1.5 font-mono font-bold text-sm text-[#0F3D75] focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Lô hàng tàu chuyến 3.000 &ndash; 55.000 MT hoặc CBM dự án
                </p>
              </div>
            </div>
          </div>

          {/* Group Thresholds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label htmlFor="inputThresholdA" className="font-semibold text-slate-700 block mb-1">
                Ngưỡng điểm tối thiểu Nhóm A (Mục tiêu cốt lõi):
              </label>
              <input
                id="inputThresholdA"
                type="number"
                min="50"
                max="95"
                value={thA}
                onChange={e => setThA(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white border border-slate-300 px-2.5 py-1.5 font-mono font-semibold focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="inputThresholdB" className="font-semibold text-slate-700 block mb-1">
                Ngưỡng điểm tối thiểu Nhóm B (Tiềm năng theo dõi):
              </label>
              <input
                id="inputThresholdB"
                type="number"
                min="20"
                max="79"
                value={thB}
                onChange={e => setThB(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white border border-slate-300 px-2.5 py-1.5 font-mono font-semibold focus:outline-none"
              />
            </div>
          </div>

          {/* Editable Keyword Dictionaries */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div>
              <label htmlFor="inputBulkKeywords" className="block font-semibold text-slate-700 mb-1">
                Từ khóa Mặt hàng Rời khô (Dry Bulk Chartering):
              </label>
              <textarea
                id="inputBulkKeywords"
                rows={2}
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                className="w-full border border-slate-300 p-2 text-slate-800 font-mono text-[11px] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="inputProjectKeywords" className="block font-semibold text-slate-700 mb-1">
                Từ khóa Hàng Dự án &amp; Breakbulk (Project Services):
              </label>
              <textarea
                id="inputProjectKeywords"
                rows={2}
                value={projectText}
                onChange={e => setProjectText(e.target.value)}
                className="w-full border border-slate-300 p-2 text-slate-800 font-mono text-[11px] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="inputNegativeKeywords" className="block font-semibold text-red-800 mb-1">
                Từ khóa Loại trừ (Negative Gate - Chuyển thẳng vào Nhóm C):
              </label>
              <textarea
                id="inputNegativeKeywords"
                rows={2}
                value={negText}
                onChange={e => setNegText(e.target.value)}
                className="w-full border border-slate-300 p-2 text-slate-800 font-mono text-[11px] focus:outline-none"
              />
            </div>
          </div>

          {/* Security & Data Masking Setting (Mục 3.5.2) */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">
                Chế độ Ẩn danh Dữ liệu nhạy cảm (Data Masking - Mục 3.5.2)
              </span>
              <span className="text-[11px] text-slate-500">
                Tự động lọc bỏ SĐT/Email cá nhân trước khi đưa vào luồng phân tích AI
              </span>
            </div>
            <input
              id="inputDataMasking"
              type="checkbox"
              checked={dataMasking}
              onChange={e => setDataMasking(e.target.checked)}
              className="w-4 h-4 border-slate-300 cursor-pointer"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-300 text-red-800 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
          >
            Khôi phục mặc định
          </button>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#0F3D75] text-white font-medium hover:bg-[#0A2B54] transition cursor-pointer"
            >
              Áp dụng &amp; Tính lại điểm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
