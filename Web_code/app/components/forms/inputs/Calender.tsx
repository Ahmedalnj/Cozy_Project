"use client";

import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { useEffect, useState } from "react";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface CalendarProps {
  value: Range;
  onChange: (value: RangeKeyDict) => void;
  disabledDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  disabledDates,
}) => {
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Try to get language context, fallback to document direction
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Check document direction
        const docDir = document.documentElement.dir;
        const docLang = document.documentElement.lang;
        
        // Set RTL based on document direction or language
        setIsRTL(docDir === 'rtl' || docLang === 'ar');
      }
    } catch {
      // Fallback to LTR if any error occurs
      setIsRTL(false);
    }
  }, []);

  return (
    <div 
      className={`calendar-container ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left"
      }}
    >
      <DateRange
        rangeColors={["#262626"]}
        ranges={[value]}
        date={new Date()}
        onChange={onChange}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
      />
    </div>
  );
};

export default Calendar;
