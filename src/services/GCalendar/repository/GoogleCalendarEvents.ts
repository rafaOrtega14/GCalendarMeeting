import ApiCalendar from "react-google-calendar-api";
import { getNextWeekdays } from "../../../utils/time";
import { Event } from "../index"

export class GoogleCalendarEvents {
  static instance: GoogleCalendarEvents;
  
  private constructor(private token: string, private calendarId: string) {}

  static getInstance(token: string | null, calendarId: string): GoogleCalendarEvents {
    if(!GoogleCalendarEvents.instance){
        if(!token) throw new Error('Could not instance google calendar API')
        GoogleCalendarEvents.instance = new GoogleCalendarEvents(token, calendarId)
    }
    return GoogleCalendarEvents.instance;
  }

  initateEvents = (): Event[] => {
    let initEvents: Event[] = []
    const days = getNextWeekdays(new Date())
    const nineToFiveAvailableSlots = ['09:00 - 11:00', '12:00 - 14:00', '15:00 - 17:00']
    days.forEach(day => {
      nineToFiveAvailableSlots.forEach((timeSlot, i) => {
        initEvents.push({ id: `${day.day}#${i}`, title: day.day, date: day.date, time: timeSlot })
      })
    })
    return initEvents.sort()
  }

  static getApiCalendarInstance() {

    const config = {
      "clientId": process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
      "apiKey": process.env.REACT_APP_GOOGLE_API_KEY || '',
      "scope": "https://www.googleapis.com/auth/calendar",
      "discoveryDocs": [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
      ]
    }
    const apiCalendar = new ApiCalendar(config)
    return apiCalendar
  }

  async getEvents() {
    const LIST_EVENTS_URL = `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`;

    const response = await fetch(LIST_EVENTS_URL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result.items;
  }

  async setEvent(
    summary: string,
    maxAttendees: number = 2,
    attendees?: Array<object>,
    start_date?: string,
    end_date?: string,
    description?: string
  ) {
    const sendNotifications = true;
    const sendUpdates = "all";
    const supportsAttachments = true;

    const CREATE_EVENT_URL = `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events/?maxAttendees=${maxAttendees}&sendNotifications=${sendNotifications}&sendUpdates=${sendUpdates}&supportsAttachments${supportsAttachments}`;
    const body = {
      summary: summary,
      description,
      start: {
        dateTime: start_date,
        timeZone: "Europe/London",
      },
      end: {
        dateTime: end_date,
        timeZone: "Europe/London",
      },
      attendees: attendees,
    };

    const response = await fetch(CREATE_EVENT_URL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return result;
  }
}
