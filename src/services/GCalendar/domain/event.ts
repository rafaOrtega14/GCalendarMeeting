export type Event = {
    id: string;
    title: string;
    date: string;
    time: string;
  }
  
export type CalendarEvent = {
    start: {
      dateTime: string
    }
}

export type GoogleAuthData = {
  access_token: string;
}