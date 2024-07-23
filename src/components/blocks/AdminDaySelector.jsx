import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Translator from '../Translator';

function AdminDaySelector({GlobalState}) {
  const {
    language,
    selectedDay,setSelectedDay,
    selectedMonth,setSelectedMonth,
    selectedYear,setSelectedYear,
  } = GlobalState;

  const monthNames = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
  ];

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [doNotChangeWeek, setDoNotChangeWeek] = useState(false);

  useEffect(() => {
    setSelectedDate(new Date(selectedYear, selectedMonth - 1, selectedDay));
  }, [selectedYear,selectedMonth,selectedDay]);

  useEffect(() => {
    if (doNotChangeWeek || selectedDate==null || selectedDate=='Invalid Date'){
      return;
    }

    const currentWeek = [];
    for (let day = (selectedDate.getDay() + 6) % 7; day > 0; day--) {
      var date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() - day);
      currentWeek.push(date);
    }

    currentWeek.push(selectedDate);

    var missingDays = 7 - currentWeek.length;
    for (let day = 1 ; day <= missingDays ; day++) {
      var date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + day);
      currentWeek.push(date);
    }
    setSelectedWeek(currentWeek);   
  }, [selectedDate,doNotChangeWeek]);

  const handlePrevMonth = () => {
    var tempSelectedMonth = ((selectedMonth + 10) % 12) + 1;
    setSelectedMonth(tempSelectedMonth);
    setSelectedYear(selectedYear => tempSelectedMonth === 12 ? selectedYear - 1 : selectedYear);
    setDoNotChangeWeek(false);
  };

  const handleNextMonth = () => {
    var tempSelectedMonth = (selectedMonth % 12) + 1;
    setSelectedMonth(tempSelectedMonth);
    setSelectedYear(selectedYear => tempSelectedMonth === 1 ? selectedYear + 1 : selectedYear);
    setDoNotChangeWeek(false);
  };

  const handlePrevWeek = () => {
    var tempDate = new Date(selectedDate);
    tempDate.setDate(tempDate.getDate() - 7);
    setSelectedDay(tempDate.getDate());
    setSelectedMonth(tempDate.getMonth()+1);
    setSelectedYear(tempDate.getFullYear());
    setDoNotChangeWeek(false);
  };

  const handleNextWeek = () => {
    var tempDate = new Date(selectedDate);
    tempDate.setDate(tempDate.getDate() + 7);
    setSelectedDay(tempDate.getDate());
    setSelectedMonth(tempDate.getMonth()+1);
    setSelectedYear(tempDate.getFullYear());
    setDoNotChangeWeek(false);
  };

  const handleDaySelection = (event,day) => {
    const clickedDay = event.currentTarget;
    var days = document.querySelectorAll(".selected-day");
    days.forEach(day => {
        day.classList.remove("selected-day");
    });
    clickedDay.classList.add("selected-day");
    setSelectedDay(day.getDate());
    setSelectedMonth(day.getMonth() + 1);
    setSelectedYear(day.getFullYear());
    setDoNotChangeWeek(true);
    };

  return (
    <div className="admin-day-selector">
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
      <div className='week-selector'>
        <div className="prev-week" onClick={handlePrevWeek}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div className='calendar'>
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
            {selectedWeek.map((day, index) => (
              <div onClick={(event) => handleDaySelection(event,day)} className={(day.getDate()) == selectedDay ? ('day selected-day') : ('day')} key={day.getDate()}>{day.getDate()}</div>
            ))}
          </div>
        </div>
        <div className="next-week" onClick={handleNextWeek}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    </div>
  )
}

export default AdminDaySelector
