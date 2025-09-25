import { useEffect, useState } from "react";
import "../Project/projectList.css";
import { api } from "../../services/api";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    prefix: "",
    displayName: "",
    description: "",
  });

  async function getProjects() {
    try {
      const token = localStorage.getItem("token");
      const companyId = "";
      const response = await api.get("/projects", {
        params: {
          companyId,
          includeDeleted: false,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.log(error, "Error while fetching projects !!");
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "prefix" ? value.toUpperCase().slice(0, 6) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await api.post("/projects", formData);
      console.log("result", result);
      setIsModalOpen(false);
      setFormData({ prefix: "", displayName: "", description: "" });
      getProjects();
    } catch (error) {
      console.log("error", error);
      alert(error);
    }
  };

  return (
    <>
      <div className="project-list-container">
        <div className="header">
          <h2>Projects</h2>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            + Add Project
          </button>
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
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "15px" }}
                >
                  No project available !!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Project</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <input
                type="text"
                name="prefix"
                placeholder="Prefix (max 6 chars)"
                value={formData.prefix}
                onChange={handleChange}
                maxLength={6}
                required
              />
              <input
                type="text"
                name="displayName"
                placeholder="Project Name"
                value={formData.displayName}
                onChange={handleChange}
                maxLength={100}
                required
              />
              <textarea
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
                maxLength={2000}
              />
              <div className="modal-actions">
                <button type="submit" className="btn save">
                  Save
                </button>
                <button
                  type="button"
                  className="btn cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
