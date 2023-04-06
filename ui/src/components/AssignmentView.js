import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpReqAsync from "../services/httpReqAsync";
import useLocalStorageState from "../util/useLocalStorageState";

const AssignmentView = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
  });
  const [jwt] = useLocalStorageState("", "jwt");

  function updateAssignmentProp(prop, value) {
    const newAsssignment = { ...assignment };
    newAsssignment[prop] = value;
    setAssignment(newAsssignment);
  }

  function saveAssignment() {
    httpReqAsync(`/api/v1/assignments/${id}`, "PUT", jwt, assignment).then(
      (assignment) => {
        setAssignment(assignment);
      }
    );
  }

  useEffect(() => {
    httpReqAsync(`/api/v1/assignments/${id}`, "GET", jwt).then((assignment) => {
      setAssignment(assignment);
    });
  }, [jwt, id]);

  console.log("assignment:" + assignment);
  return (
    <div>
      Assignment with id {id}
      {assignment ? (
        <>
          <div>Status {assignment.status}</div>
          <div>
            GitHub URL:
            <input
              type="url"
              id="githubUrl"
              onChange={(e) => {
                updateAssignmentProp("githubUrl", e.target.value);
              }}
              value={assignment.githubUrl}
            />
          </div>
          <div>
            Branch:
            <input
              type="text"
              id="branch"
              onChange={(e) => {
                updateAssignmentProp("branch", e.target.value);
              }}
              value={assignment.branch}
            />
          </div>
          <button onClick={saveAssignment}>Save</button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AssignmentView;
