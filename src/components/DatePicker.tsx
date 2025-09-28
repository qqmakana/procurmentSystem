import React, { useState } from 'react';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  placeholder = "Select date", 
  className = "",
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const getToday = () => new Date();
  
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const getNextWeek = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  };

  const getNextMonth = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-white mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="input-field w-full text-left flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors duration-200"
        >
          <span className={selectedDate ? 'text-white' : 'text-gray-400'}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-2xl z-50 p-4">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-700 mb-3">Quick Select</div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDateSelect(getToday())}
                  className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Today
                </button>
                <button
                  onClick={() => handleDateSelect(getTomorrow())}
                  className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => handleDateSelect(getNextWeek())}
                  className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Next Week
                </button>
                <button
                  onClick={() => handleDateSelect(getNextMonth())}
                  className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Next Month
                </button>
              </div>

              <div className="border-t pt-3">
                <div className="text-sm font-semibold text-gray-700 mb-2">Custom Date</div>
                <input
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleDateSelect(new Date(e.target.value));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    onChange(new Date());
                    setIsOpen(false);
                  }}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;

