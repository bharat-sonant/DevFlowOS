import { useEffect, useState } from "react";
import "../Project/projectList.css";
import { api } from "../../services/api";
import ConfirmModal from "../../shared/ConfirmModal";
import AddProject, { Project } from "./AddProject";

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    prefix: "",
    displayName: "",
    description: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [editProjectList, setEditProjectList] = useState<Project | null>(null);;

  const companyId = localStorage.getItem('companyId');

  async function getProjects() {
    try {
      const response = await api.get("/projects", {
        params: {
          companyId,
          includeDeleted: false,
        },
      });
      setProjects(response.data.data);
    } catch (error) {
      console.log(error, "Error while fetching projects !!");
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  const handleSaveProject = (project: any) => {
    // push new project locally
    // setProjects((prev) => [project, ...prev]);
  };


  const handleDelete = async () => {
    setDeleteLoader(true);
    setIsDeleted(true);
    try {
      const response = await api.delete("/projects", {
        params: {
          //parameters
        },
      });

      if (response) {
        setDeleteModalOpen(false);
      } else {
        setDeleteModalOpen(false);
      }
    } catch (error) {
      console.log(error, "Error while deleting project !!!");
    } finally {
      setTimeout(() => {
        setDeleteLoader(false);
        setDeleteModalOpen(false);
      }, 1000)
    }
  };

  const handleEditProject = (project: Project) => {
    setEditProjectList(project)
    setIsModalOpen(true);
  }

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
                  <td>{proj.name ? proj.name : proj.displayName}</td>
                  <td>{proj.description}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={proj.is_active === true}
                      // onChange={() => handleToggleStatus(proj.id, proj.status)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="actions">
                    <button className="btn edit" onClick={() => handleEditProject(proj)}>Edit</button>
                    <button className="btn delete" onClick={() => setDeleteModalOpen(true)}>{isDeleted === false ? 'Delete' : 'Restore'}</button>
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
        <AddProject
          initialData={editProjectList ?? undefined}
          onClose={() => { setIsModalOpen(false), setEditProjectList(null) }}
          onSave={handleSaveProject}
          setProjects={setProjects}
        />
      )}
      {deleteModalOpen && (
        <ConfirmModal
          title="Delete project !!!"
          message="Are you sure you want to delete this project?"
          onConfirm={handleDelete}
          onCancel={() => [setDeleteModalOpen(false), setDeleteLoader(false), setIsDeleted(false)]}
          confirmText="Confirm"
          cancelText="Cancel"
          loading={deleteLoader}
        />
      )}
    </>
  );
}
