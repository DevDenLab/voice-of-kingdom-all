import React from 'react';
import AppRoutes from './Routes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

function App() {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
