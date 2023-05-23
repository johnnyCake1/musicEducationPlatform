import React, { useState } from "react";
import "./TabbedPage.css";

const TabbedPage = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="tabbed-page">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={activeTab === tab.name ? "active" : ""}
            onClick={() => handleTabClick(tab.name)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`tab-content ${activeTab === tab.name ? "active" : ""}`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default TabbedPage;
