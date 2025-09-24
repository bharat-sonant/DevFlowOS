import { useEffect, useState } from "react";
import "../Project/projectList.css";
import { api } from "../../services/api";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  async function getProjects() {
    try {
      const response = await api.get("");
      console.log(response.data);
      setProjects(response.data);
    } catch (error) {
      console.log(error, "Error while fetching projects !!");
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="project-list-container">
      <div className="header">
        <h2>Projects</h2>
        <button className="add-btn">+ Add Project</button>
      </div>

      <table className="project-table">
        <thead>
          <tr>
            <th>Prefix</th>
            <th>Project Name</th>
            <th>Description</th>
            <th>Status</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((proj, index) => (
              <tr key={index}>
                <td>{proj.prefix}</td>
                <td>{proj.displayName}</td>
                <td>{proj.description}</td>
                <td>
                  <span
                    className={`status ${proj.status
                      .toLowerCase()
                      .replace(" ", "")}`}
                  >
                    {proj.status}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn edit">Edit</button>
                  <button className="btn delete">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "15px" }}>
                No project available !!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

