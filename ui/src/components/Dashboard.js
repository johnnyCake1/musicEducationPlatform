import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {httpReqAsync} from "../services/httpReqAsync";
import useLocalStorageState from "../util/useLocalStorageState";

const Dashboard = () => {
  console.log("hello from Dashboard!");
  const [jwt] = useLocalStorageState("", "jwt");

  const [assignments, setAssignments] = useState(null);

  useEffect(() => {
    httpReqAsync("api/v1/assignments", "GET", jwt).then((assignmentData) => {
      setAssignments(assignmentData);
    });
  }, [jwt]);

  const createAssignment = () => {
    httpReqAsync("api/v1/assignments", "POST", jwt).then((assignment) => {
      window.location.href = `/assignments/${assignment.id}`;
    });
  };
  console.log("byebye from Dashboard!");

  return (
    <div style={{ margin: "2em" }} className="rel">
      Welcome to my dahsboard!
      {assignments ? (
        assignments.map((assignment) => (
          <div key={assignment.id}>
            <Link to={`/assignments/${assignment.id}`}>
              Assignment ID: {assignment.id}
            </Link>
          </div>
        ))
      ) : (
        <></>
      )}
      <button onClick={createAssignment}>Submit New Assignment</button>
    </div>
  );
};

export default Dashboard;
