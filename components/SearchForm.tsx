
import React, { useState } from 'react';
import { CITIES, COURSE_CATEGORIES, ISHA_PRIMARY_COLOR } from '../constants';
import { SearchParams } from '../types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [params, setParams] = useState<SearchParams>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    city: '臺北市',
    category: COURSE_CATEGORIES[0],
    customKeyword: '',
    isRefresher: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border-t-4" style={{ borderTopColor: ISHA_PRIMARY_COLOR }}>
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ISHA_PRIMARY_COLOR}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        課程快速檢索
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">開始日期</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            value={params.startDate}
            onChange={(e) => setParams({ ...params, startDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">結束日期</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            value={params.endDate}
            onChange={(e) => setParams({ ...params, endDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">想上課的縣市</label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            value={params.city}
            onChange={(e) => setParams({ ...params, city: e.target.value })}
          >
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">想上什麼課</label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            value={params.category}
            onChange={(e) => setParams({ ...params, category: e.target.value })}
          >
            {COURSE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {params.category === '其他' && (
        <div className="mt-4 space-y-1 animate-fade-in">
          <label className="block text-sm font-medium text-gray-700">請輸入課程關鍵字</label>
          <input
            type="text"
            placeholder="例如：施工架、急救、丙業..."
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none border-green-200"
            value={params.customKeyword}
            onChange={(e) => setParams({ ...params, customKeyword: e.target.value })}
            required
          />
          <p className="text-[10px] text-gray-500 italic">AI 將協助檢索語意、發音或意思接近的課程。</p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 bg-green-50 p-3 rounded-md">
        <input
          type="checkbox"
          id="refresher"
          className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          checked={params.isRefresher}
          onChange={(e) => setParams({ ...params, isRefresher: e.target.checked })}
        />
        <label htmlFor="refresher" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
          是否要回訓？ (勾選後將檢索包含「在職」之課程)
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-3 px-4 rounded-md text-white font-bold text-lg transition-all active:scale-[0.98] disabled:bg-gray-400"
        style={{ backgroundColor: isLoading ? '#9ca3af' : ISHA_PRIMARY_COLOR }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            AI 檢索中...
          </span>
        ) : '開始搜尋'}
      </button>
    </form>
  );
};

export default SearchForm;
