
import React from 'react';
import { Course, IshaCenter } from '../types';
import { ISHA_SECONDARY_COLOR, ISHA_PRIMARY_COLOR } from '../constants';

interface ResultListProps {
  courses: Course[];
  centers: IshaCenter[];
  sources: any[];
  searchedCity: string;
}

const ResultList: React.FC<ResultListProps> = ({ courses, centers, sources, searchedCity }) => {
  const validateLink = (link: string): string => {
    const fallback = "https://isha.org.tw/Msite/tech/serch.aspx";
    if (!link) return fallback;
    
    try {
      const url = new URL(link);
      if (url.hostname.includes('isha.org.tw')) {
        return link;
      }
      return fallback;
    } catch (e) {
      if (link.startsWith('/')) {
        return `https://isha.org.tw${link}`;
      }
      return fallback;
    }
  };

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-12 rounded-xl shadow-md text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">目前沒有找到符合條件的課程，請調整日期或類別再試一次。</p>
        </div>
        
        {centers.length > 0 && (
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 animate-fade-in">
            <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {searchedCity} 地區相關職訓中心 (資料來源：ISHA 官網)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {centers.map((center, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-green-50">
                  <h5 className="font-bold text-gray-900">{center.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">📍 {center.address}</p>
                  <p className="text-sm font-medium text-green-700 mt-1">📞 {center.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl font-bold text-gray-800">搜尋結果 ({courses.length})</h3>
        <div className="bg-emerald-50 text-emerald-800 text-sm py-2 px-4 rounded-lg border border-emerald-100 shadow-sm flex items-start gap-2 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="leading-snug">
            如果連結未能跳轉至對應課程，請直接電洽對應的職訓中心，協會期待您的光臨
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => {
          const validatedLink = validateLink(course.link);
          return (
            <div 
              key={course.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border-l-8"
              style={{ borderLeftColor: course.isRefresher ? ISHA_SECONDARY_COLOR : ISHA_PRIMARY_COLOR }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold text-white ${course.isRefresher ? 'bg-emerald-500' : 'bg-green-700'}`}>
                    {course.isRefresher ? '回訓/在職' : '初訓'}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">📅 {course.date}</span>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                  {course.name}
                </h4>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-7a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{course.centerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{course.city} - {course.address}</span>
                  </div>
                </div>
                
                <a 
                  href={validatedLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 px-4 rounded-md font-bold text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: ISHA_PRIMARY_COLOR }}
                >
                  查看詳情與報名
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {centers.length > 0 && (
        <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100">
          <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            您所查詢縣市的職訓中心聯絡資訊 (檢索自官網)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centers.map((center, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-green-50">
                <h5 className="font-bold text-gray-900">{center.name}</h5>
                <p className="text-sm text-gray-600 mt-1">📍 {center.address}</p>
                <p className="text-sm font-medium text-green-700 mt-1">📞 {center.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {sources.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-bold text-gray-600 mb-2">資料來源：</h4>
          <ul className="text-xs text-green-700 space-y-1">
            {sources.map((src, i) => (
              <li key={i} className="truncate">
                <a href={src.web?.uri} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {src.web?.title || src.web?.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultList;
