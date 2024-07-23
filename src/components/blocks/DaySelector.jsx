import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Translator from '../Translator';

function DaySelector({GlobalState}) {
  const {
    language, setSelectedTime, setSelectedDay,
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    storeWorkingHoursData,
  } = GlobalState;

  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const [currentDate,setCurrentDate] = useState(new Date());
  const [currentDay,setCurrentDay] = useState(new Date().getDate());
  const [currentMonth,setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear,setCurrentYear] = useState(new Date().getFullYear());

  const [emptyDaysArray,setEmptyDaysArray] = useState([]);
  const [daysArray,setDaysArray] = useState([]);

  useEffect(() => {
    var firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    if (firstDayOfMonth==0){firstDayOfMonth = 7;}
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  
    const emptyDaysArray = [];
    for (let day = 0; day <firstDayOfMonth - 1; day++) {
        emptyDaysArray.push(day);
    }
    setEmptyDaysArray(emptyDaysArray);
    
    const daysArray = [];
    for (let day = 1; day <= daysInMonth; day++) {
        daysArray.push(day);
    }
    setDaysArray(daysArray);
  }, [selectedMonth, selectedYear]);

  const handlePrevMonth = () => {
    var tempSelectedMonth = ((selectedMonth + 10) % 12) + 1;
    setSelectedMonth(tempSelectedMonth);
    setSelectedYear(selectedYear => tempSelectedMonth === 12 ? selectedYear - 1 : selectedYear);

    var days = document.querySelectorAll(".selected-day");
    days.forEach(day => {
      day.classList.remove("selected-day");
    });
    setSelectedDay();

    var times = document.querySelectorAll(".selected-time");
    times.forEach(time => {
      time.classList.remove("selected-time");
    });
    setSelectedTime();
  };

  const handleNextMonth = () => {
    var tempSelectedMonth = (selectedMonth % 12) + 1;
    setSelectedMonth(tempSelectedMonth);
    setSelectedYear(selectedYear => tempSelectedMonth === 1 ? selectedYear + 1 : selectedYear);

    var days = document.querySelectorAll(".selected-day");
    days.forEach(day => {
      day.classList.remove("selected-day");
    });
    setSelectedDay();

    var times = document.querySelectorAll(".selected-time");
    times.forEach(time => {
      time.classList.remove("selected-time");
    });
    setSelectedTime();
  };

  const handleDaySelection = (event,day) => {
    const clickedDay = event.currentTarget;
    var days = document.querySelectorAll(".selected-day");
    days.forEach(day => {
      day.classList.remove("selected-day");
    });
    clickedDay.classList.add("selected-day");
    setSelectedDay(day);

    var times = document.querySelectorAll(".selected-time");
    times.forEach(time => {
      time.classList.remove("selected-time");
    });
    setSelectedTime()
  };

  return (
    <div className="day-selector card">
      <div className="top">
        <div className="prev-month" onClick={handlePrevMonth}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div className="month">
          <Translator
            code={language}
            value={monthNames[selectedMonth - 1]}
          />
          {" "}
          {selectedYear}
        </div>
        <div className="next-month" onClick={handleNextMonth}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
      <div className="names">
        <div>
          <Translator
            code={language}
            value={"Mon"}
          />
        </div>
        <div>
          <Translator
            code={language}
            value={"Tus"}
          />
        </div>
        <div>
          <Translator
            code={language}
            value={"Wed"}
          />
        </div>
        <div>
          <Translator
            code={language}
            value={"Thu"}
          />
        </div>
        <div>
          <Translator
            code={language}
            value={"Fri"}
          />
        </div>
        <div>
          <Translator
            code={language}
            value={"Sat"}
          />
        </div>
        <div>
          <Translator
            code={language}
            value={"Sun"}
          />
        </div>
      </div>
      <div className="days">
        {emptyDaysArray.map((day) => (
          <div key={day} className="no-day"></div>
        ))}
        {daysArray.map((day, index) => (
          (((index>=currentDay-1 && currentMonth==selectedMonth && currentYear == selectedYear) || 
          (selectedMonth > currentMonth && selectedYear == currentYear) || (selectedYear > currentYear)) && 
          (storeWorkingHoursData.some(row =>row.status==1 && row.day == ((new Date(selectedYear, selectedMonth - 1, day)).getDay()==0 ? 7 : (new Date(selectedYear, selectedMonth - 1, day)).getDay())))
          ) ? (<div onClick={(event) => handleDaySelection(event,day)} className="day" key={day}>{day}</div>) : (<div className="day locked" key={day}>{day}</div>)
        ))}
      </div>
    </div>
  )
}

export default DaySelector
