import { useEffect, useState } from "react";
import "../Project/projectList.css";
import { api } from "../../services/api";
import ConfirmModal from "../../shared/ConfirmModal";
import AddProject, { Project } from "./AddProject";

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [editProjectList, setEditProjectList] = useState<Project | null>(null);;
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const companyId = localStorage.getItem('companyId');

  async function getProjects() {
    setLoading(true);
    try {
      const response = await api.get("/projects", {
        params: {
          companyId,
          includeDeleted,
        },
      });
      setProjects(response.data.data);
    } catch (error) {
      console.log(error, "Error while fetching projects !!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProjects();
  }, [includeDeleted]);

  const handleSaveProject = (project: any) => {
    // push new project locally
    // setProjects((prev) => [project, ...prev]);
  };

  const openDeleteModal = (id: string) => {
    setProjectToDelete(id);
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    setDeleteLoader(true);
    try {
      const response = await api.patch(`/projects/${projectToDelete}/status`, {
        action: 'DELETE'
      });

      if (response.status === 200) {
        setProjects((prev) => {
          if (includeDeleted) {
            return prev.map((p) =>
              p.id === projectToDelete
                ? { ...p, is_deleted: true, is_active: false }
                : p
            );
          } else {
            return prev.filter((p) => p.id !== projectToDelete);
          }
        });
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
      }, 1000);
    }
  };


  const handleEditProject = (project: Project) => {
    setEditProjectList(project)
    setIsModalOpen(true);
  }

  const handleToggleStatus = async (projectId: string, currentStatus: boolean) => {
    try {
      const action = currentStatus ? 'DEACTIVATE' : 'ACTIVATE';

      await api.patch(`/projects/${projectId}/status`, { action });
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === projectId ? { ...proj, is_active: !currentStatus } : proj
        )
      );
    } catch (error) {
      console.log(error, "Error while updating project status!");
    }
  };

  const handleRestore = async (projectId: string) => {
    try {
      const response = await api.patch(`/projects/${projectId}/status`, {
        action: "RESTORE",
      });

      if (response.status === 200) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, is_deleted: false, is_active: true } : p
          )
        );
      }
    } catch (error) {
      console.log(error, "Error while restoring project!");
    }
  };

  return (
    <>
      <div className="project-list-container">
        <div className="header">
          <h2>Projects</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
              />
              Include deleted
            </label>
            <button className="add-btn" onClick={() => setIsModalOpen(true)}>
              + Add Project
            </button>
          </div>

        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div className="loader"></div>
            <div>Please wait...</div>
          </div>
        ) : (
          <div className="project-table-container">
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
                    <tr key={index} className={proj.is_deleted ? "deleted-row" : ""}>
                      <td>{proj.prefix}</td>
                      <td>{proj.name ?? proj.displayName}</td>
                      <td>{proj.description}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            disabled={proj.is_deleted}
                            checked={proj.is_active === true}
                            onChange={() => handleToggleStatus(proj.id, proj.is_active)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td className="actions">
                        {!proj.is_deleted ? (
                          <>
                            <button className="btn edit" onClick={() => handleEditProject(proj)}>Edit</button>
                            <button className="btn delete" onClick={() => openDeleteModal(proj.id)}>Delete</button>
                          </>
                        ) : (
                          <button className="btn restore" onClick={() => handleRestore(proj.id)}>Restore</button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "15px" }}>
                      No project available !!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

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
          onCancel={() => [setDeleteModalOpen(false), setDeleteLoader(false)]}
          confirmText="Confirm"
          cancelText="Cancel"
          loading={deleteLoader}
        />
      )}
    </>
  );
}
