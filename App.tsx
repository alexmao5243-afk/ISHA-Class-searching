
import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultList from './components/ResultList';
import SafetyFactTicker from './components/SafetyFactTicker';
import { searchIshaCourses } from './services/geminiService';
import { Course, IshaCenter, SearchParams } from './types';
import { ISHA_PRIMARY_COLOR } from './constants';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [centers, setCenters] = useState<IshaCenter[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchedCity, setLastSearchedCity] = useState<string>("");

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setLastSearchedCity(params.city);
    try {
      const result = await searchIshaCourses(params);
      setCourses(result.courses);
      setCenters(result.centers);
      setSources(result.sources);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setError("檢索過程中發生錯誤，請確認網路連線或稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 sticky top-0 z-50" style={{ borderBottomColor: ISHA_PRIMARY_COLOR }}>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold italic text-xl border-2 border-emerald-400 shadow-md">
              ISHA
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">中華民國工業安全衛生協會</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">職訓課程智慧檢索系統 (Green Ed.)</p>
            </div>
          </div>
          <div className="hidden md:block">
            <a href="https://isha.org.tw" target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:underline" style={{ color: ISHA_PRIMARY_COLOR }}>
              ISHA 官網
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <SearchForm onSearch={handleSearch} isLoading={loading} />
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="text-sm font-bold text-green-800 mb-1 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  小撇步
                </h5>
                <p className="text-xs text-green-700 leading-relaxed">
                  若您是想要參加複訓，請務必勾選「是否要回訓」，AI 會自動幫您加上「在職」關鍵字進行更精確的檢索。
                </p>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000-16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {!hasSearched && !loading && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center border-dashed border-2 border-gray-200">
                <div className="text-6xl mb-6 opacity-30">🏫</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">準備好開始學習了嗎？</h3>
                <p className="text-gray-500">在左側輸入您的需求，我們將為您從 ISHA 官網檢索最新的課程資訊。</p>
              </div>
            )}

            {loading ? (
              <div className="space-y-8">
                {/* Safety Fact Rotation during Loading */}
                <SafetyFactTicker />
                
                {/* Visual Skeleton placeholders below the fact ticker */}
                <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse bg-white p-6 rounded-xl shadow-sm border-l-8 border-gray-100">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 rounded"></div>
                          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              hasSearched && <ResultList courses={courses} centers={centers} sources={sources} searchedCity={lastSearchedCity} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm mb-4 leading-relaxed">本應用程式僅提供搜尋與檢索服務，所有課程資訊以 <a href="https://isha.org.tw" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-bold">ISHA 中華民國工業安全衛生協會</a> 官網公告為準。</p>
          <div className="w-16 h-1 bg-gray-700 mx-auto mb-6"></div>
          <p className="text-xs uppercase tracking-widest">© 2024 ISHA Course Finder Helper. Powered by Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
