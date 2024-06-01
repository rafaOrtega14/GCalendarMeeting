import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropertyCTA from './components/PropertyCTA/PropertyCTA';
import EventList from './components/EventList/EventList';

const App: React.FC = () => {
  return (
    <PropertyCTA></PropertyCTA>
  );
};

export default App;