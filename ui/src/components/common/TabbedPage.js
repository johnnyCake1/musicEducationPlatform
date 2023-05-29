import React, { useState } from "react";
import "./TabbedPage.css";

const TabbedPage = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
    <nav className="cd-secondary-nav border-b md:m-0 nav-small">
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className={activeTab === tab.name ? "active" : ""}
            >
              <a
                href="#"
                onClick={() => handleTabClick(tab.name)}
                className="lg:px-2"
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
    </nav>
    <div className="mt-5">
      {
        tabs.map((tab) => (
          <div
            key={tab.name}
            className={`tab-content ${activeTab === tab.name ? "active" : ""}`}
          >
            {tab.content}
          </div>
        ))
      }
    </div>
    
    </>
  );
};

export default TabbedPage;
