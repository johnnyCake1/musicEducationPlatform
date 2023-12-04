import React, { useState } from 'react';
import PrivateRoute from './PrivateRoute';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import '../../App.css';

function WithSidebarAndAuth(PageComponent) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <PrivateRoute>
      <div className="">
        <Navigation toggleSidebar={toggleSidebar} />
        <div className="main_content">
          <PageComponent />
        </div>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>
    </PrivateRoute>
  );
}

export default WithSidebarAndAuth;
