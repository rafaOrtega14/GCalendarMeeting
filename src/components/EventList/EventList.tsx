import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { GoogleCalendarEvents, CalendarEvent, Event } from '../../services/GCalendar';
import './EventList.css';
import 'react-toastify/dist/ReactToastify.css';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const googleCalendarService = GoogleCalendarEvents.getInstance(
    localStorage.getItem('googleToken'),
    process.env.REACT_APP_GOOGLE_CALENDAR_ID ?? ''
  );
  useEffect(() => {
    if(events.length === 0) {
      compareCalendarEvents()
    }
  })

  const compareCalendarEvents = async () => {
    const defaultEvents = googleCalendarService.initateEvents()
    const calendarEvents = await googleCalendarService.getEvents() as Array<CalendarEvent>
    if(calendarEvents.length === 0) return setEvents(defaultEvents);
    const defaultEventsLeft = calendarEvents.map(calendarEvent => {
      const eventsLeft = defaultEvents?.filter(event => {
        const [startHour] = event.time.split('-')
        return `${event.date}T${startHour.trim().slice(0, -3)}:00+01:00` !== calendarEvent.start.dateTime
      })
      return eventsLeft.flat()
    });
    setEvents(defaultEventsLeft.flat() ?? defaultEvents);
  };

  const deleteCalendarEvent = (id: string) => {
    const eventsLeft = events.filter(event => event.id !== id);
    setEvents(eventsLeft)
  };

  const handleReserve = async (event: Event) => {
    try {
      const [startHour, endHour] = event.time.split('-')
      await googleCalendarService.setEvent(
            'Rafa<>Adam',
            10,
            [{email: 'r.ortega.caceres@gmail.com'}],
            `${event.date}T${startHour.trim().slice(0, -3)}:00+01:00`,
            `${event.date}T${endHour.trim().slice(0, -3)}:00+01:00`,
            `You have scheduled an appointment to view a charming single-family home located in a peaceful neighborhood.`
          )
      deleteCalendarEvent(event.id)
      toast("Congratulations! You have successfully scheduled a meeting");
    } catch(e) {
      console.log(e)
    }
  };

  return (
    <div className="event-list-container">
    {events.length > 0 && (
      <div>
        <h1 className="event-list-title">No more Available meetings</h1>
        <a href='mailto:r.ortega.caceres@gmail.com'><p className="event-list-title">Mail r.ortega.caceres@gmail.com here</p></a>
      </div>
    )}
      <h1 className="event-list-title">Available Meetings</h1>
      <ul className="event-list">
        {events && events.map(event => (
          <li key={event.id} className="event-item">
            <div className="event-details">
              <h2 className="event-title">{event.title}</h2>
              <p className="event-date">{event.date}</p>
              <p className="event-time">{event.time}</p>
            </div>
            <button className="reserve-button" onClick={() => handleReserve(event)}>
              Schedule
            </button>
          </li>
        ))}
       <ToastContainer position='top-center' />
      </ul>
    </div>
  );
}

export default EventList;
