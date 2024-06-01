import React from 'react';
import './PropertyCTA.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { GoogleAuthData, GoogleCalendarEvents } from '../../services/GCalendar';

const PropertyCTA: React.FC = () => {
  const navigate = useNavigate()
  const googleAuthInstance = GoogleCalendarEvents.getApiCalendarInstance()
  const googleAuth = async () => {
    try {
      const hour = 1000 * 60 * 60;
      const expireTokenTime = localStorage.getItem("googleTokenExpiration")
      if(expireTokenTime && parseInt(expireTokenTime) + hour > Date.now()) {
        navigate('/calendar')
      } else {
        const authData = await googleAuthInstance.handleAuthClick() as unknown as GoogleAuthData
        const token = authData['access_token']
  
        localStorage.setItem("googleToken", token)
        localStorage.setItem("googleTokenExpiration",  Date.now().toString())
        navigate('/calendar')
      }

    } catch(e) {
      toast("Something went wrong please try again")
    }

  }
  return (
    <div className="cta-container">
      <div className="cta-content">
        <h1 className="cta-title">¡Hannah you have a new request!</h1>
        <p className="cta-description">r.ortega.caceres@gmail.com wants to see the property</p>
        <button className="cta-button" onClick={() => googleAuth()}>
          Login with Google
        </button>
      </div>
      <ToastContainer position='top-center' />
    </div>
  );
}

export default PropertyCTA;