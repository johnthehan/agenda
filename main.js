import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  BookOpen, 
  PenTool, 
  Save, 
  CheckCircle2,
  AlertCircle,
  X,
  Moon,
  Sun
} from 'lucide-react';

const PERIODS = [0, 1, 2, 3, 4, 5, 6];

const getPSTDate = () => {
  const now = new Date();
  const pstString = now.toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const [month, day, year] = pstString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateKey = (date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

const formatDateDisplay = (date) => {
  const today = getPSTDate();
  
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = d.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const App = () => {
  const [currentDate, setCurrentDate] = useState(getPSTDate());
  const [agendaData, setAgendaData] = useState({});
  const [defaultClasses, setDefaultClasses] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedAgenda = localStorage.getItem('student_agenda_data');
    const savedDefaults = localStorage.getItem('student_agenda_defaults');
    const savedTheme = localStorage.getItem('student_agenda_theme');
    
    if (savedAgenda) setAgendaData(JSON.parse(savedAgenda));
    if (savedDefaults) setDefaultClasses(JSON.parse(savedDefaults));
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('student_agenda_data', JSON.stringify(agendaData));
    }
  }, [agendaData, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('student_agenda_defaults', JSON.stringify(defaultClasses));
    }
  }, [defaultClasses, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('student_agenda_theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isLoaded]);

  const changeDay = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const jumpToToday = () => {
    setCurrentDate(getPSTDate());
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleInputChange = (period, field, value) => {
    const dateKey = formatDateKey(currentDate);
    
    setAgendaData(prev => {
      const dayData = prev[dateKey] || {};
      const periodData = dayData[period] || {};
      
      return {
        ...prev,
        [dateKey]: {
          ...dayData,
          [period]: {
            ...periodData,
            [field]: value
          }
        }
      };
    });
  };

  const handleDefaultClassChange = (period, value) => {
    setDefaultClasses(prev => ({
      ...prev,
      [period]: value
    }));
  };

  const dateKey = formatDateKey(currentDate);
  const dayData = agendaData[dateKey] || {};

  const getPeriodColor = (p) => {
    const colors = [
      'border-l-purple-500', 
      'border-l-blue-500',   
      'border-l-green-500',  
      'border-l-yellow-500', 
      'border-l-orange-500', 
      'border-l-red-500',    
      'border-l-pink-500'    
    ];
    return colors[p] || 'border-l-gray-500';
  };

  const getPeriodBadgeColor = (p, dark) => {
    const lightColors = [
      'bg-purple-100 text-purple-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-orange-100 text-orange-800',
      'bg-red-100 text-red-800',
      'bg-pink-100 text-pink-800'
    ];
    const darkColors = [
      'bg-purple-900 text-purple-100',
      'bg-blue-900 text-blue-100',
      'bg-green-900 text-green-100',
      'bg-yellow-900 text-yellow-100',
      'bg-orange-900 text-orange-100',
      'bg-red-900 text-red-100',
      'bg-pink-900 text-pink-100'
    ];
    return dark ? (darkColors[p] || 'bg-gray-700 text-gray-200') : (lightColors[p] || 'bg-gray-100 text-gray-800');
  };

  const bgClass = isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800';
  const cardClass = isDarkMode ? 'bg-gray-800 shadow-md border-gray-700' : 'bg-white shadow-sm';
  const headerClass = isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white shadow-sm';
  const inputClass = isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-800 placeholder-gray-400';
  const textAreaBoxClass = isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50';
  const textAreaTextClass = isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400';
  const navBtnClass = isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-white text-gray-600 shadow-sm';
  const centerNavClass = isDarkMode ? 'bg-gray-700/50 text-gray-200' : 'bg-gray-100 text-gray-800';

  return (
    <div className={`min-h-screen font-sans pb-20 transition-colors duration-200 ${bgClass}`}>
      <header className={`sticky top-0 z-10 transition-colors duration-200 ${headerClass}`}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <BookOpen className="w-6 h-6 text-indigo-500" />
              My Agenda
            </h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Configure Class Names"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={`flex items-center justify-between p-1 rounded-lg transition-colors ${centerNavClass}`}>
            <button 
              onClick={() => changeDay(-1)}
              className={`p-2 rounded-md transition-all ${navBtnClass}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={jumpToToday}
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md transition-colors ${isDarkMode ? 'hover:bg-gray-600 text-indigo-400' : 'hover:bg-white text-indigo-600'}`}
              >
                Go to Today
              </button>
              <div className="flex flex-col items-center leading-tight">
                <span className={`font-semibold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {formatDateDisplay(currentDate)}
                </span>
                {(['Today', 'Tomorrow', 'Yesterday'].includes(formatDateDisplay(currentDate))) && (
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            <button 
              onClick={() => changeDay(1)}
              className={`p-2 rounded-md transition-all ${navBtnClass}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {PERIODS.map((period) => {
          const pData = dayData[period] || {};
          const subject = pData.subject || defaultClasses[period] || '';
          
          return (
            <div 
              key={period} 
              className={`rounded-xl border-l-4 ${getPeriodColor(period)} overflow-hidden transition-all hover:shadow-md ${cardClass}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 w-full">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getPeriodBadgeColor(period, isDarkMode)}`}>
                      Period {period}
                    </span>
                    <input 
                      type="text"
                      placeholder={defaultClasses[period] ? defaultClasses[period] : "Add Subject..."}
                      value={pData.subject !== undefined ? pData.subject : (defaultClasses[period] || '')}
                      onChange={(e) => handleInputChange(period, 'subject', e.target.value)}
                      className={`font-bold text-lg border-none focus:ring-0 p-0 bg-transparent flex-1 ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`rounded-lg p-3 group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all ${textAreaBoxClass}`}>
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <PenTool className="w-3 h-3" />
                      <span>Classwork / Notes</span>
                    </div>
                    <textarea
                      placeholder="What did we do today?"
                      value={pData.notes || ''}
                      onChange={(e) => handleInputChange(period, 'notes', e.target.value)}
                      className={`w-full bg-transparent border-none p-0 text-sm focus:ring-0 resize-none min-h-[60px] ${textAreaTextClass}`}
                    />
                  </div>

                  <div className={`rounded-lg p-3 group transition-all border ${
                    pData.homework 
                      ? (isDarkMode ? 'bg-red-900/20 border-red-700/50' : 'bg-red-50 border-red-100') 
                      : (isDarkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50 border-green-100')
                  }`}>
                    <div className={`flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider ${
                      pData.homework 
                        ? (isDarkMode ? 'text-red-300' : 'text-red-600') 
                        : (isDarkMode ? 'text-green-300' : 'text-green-600')
                    }`}>
                      {pData.homework ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      <span>Homework</span>
                    </div>
                    <textarea
                      placeholder="No homework..."
                      value={pData.homework || ''}
                      onChange={(e) => handleInputChange(period, 'homework', e.target.value)}
                      className={`w-full bg-transparent border-none p-0 text-sm focus:ring-0 resize-none min-h-[60px] ${textAreaTextClass}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="text-center pt-8 text-gray-400 text-sm">
          <p>Changes are saved automatically to this device.</p>
        </div>
      </main>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                <Settings className="w-5 h-5 text-gray-500" />
                Schedule Settings
              </h2>
              <button 
                onClick={() => setShowSettings(false)}
                className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Set your default classes here. These will appear automatically on new days.
              </p>
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {PERIODS.map(period => (
                  <div key={period} className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${getPeriodBadgeColor(period, isDarkMode)}`}>
                      {period}
                    </span>
                    <input
                      type="text"
                      placeholder={`Class Name for Period ${period}`}
                      value={defaultClasses[period] || ''}
                      onChange={(e) => handleDefaultClassChange(period, e.target.value)}
                      className={`flex-1 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={`px-6 py-4 flex justify-end ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <button 
                onClick={() => setShowSettings(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
