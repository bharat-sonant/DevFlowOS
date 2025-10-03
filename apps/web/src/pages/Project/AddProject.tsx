import React, { useState } from "react";
import { api } from "../../services/api";
import "../Project/AddProject.css";

export interface Project {
  id?: string;
  prefix: string;
  name: string;
  description?: string;
}

interface ProjectFormProps {
  initialData?: Project; 
  onClose: () => void;
  onSave: (project: Project) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onClose,
  onSave,
  setProjects,
}) => {
  const [formData, setFormData] = useState<Project>({
    prefix: initialData?.prefix || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);

    try {
      const payload = {
        prefix: formData.prefix,
        name: formData.name,
        description: formData.description,
      };

      let result;

      if (initialData?.id) {
        result = await api.put(`/projects/${initialData.id}`, payload);
      } else {
        result = await api.post("/projects", payload);
      }

      const newProject: Project = {
        id: result.data.data.id,
        prefix: result.data.data.prefix,
        name: result.data.data.name,
        description: result.data.data.description,
      };

      onSave(newProject);
      setProjects((prev) => {
        if (initialData?.id) {
          return prev.map((p) => (p.id === newProject.id ? newProject : p));
        }
        return [...prev, newProject];
      });

      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{initialData ? "Edit Project" : "Create New Project"}</h3>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Prefix */}
          <div className="form-group">
            <label htmlFor="prefix">
              Project Prefix <span className="required">*</span>
            </label>
            <input
              id="prefix"
              type="text"
              name="prefix"
              placeholder="e.g., PROJ"
              value={formData.prefix}
              onChange={handleChange}
              maxLength={6}
              required
            />
            <span className="helper-text">
              Maximum 6 characters, auto-converted to uppercase
            </span>
          </div>

          {/* Display Name */}
          <div className="form-group">
            <label htmlFor="displayName">
              Project Name <span className="required">*</span>
            </label>
            <input
              id="displayName"
              type="text"
              name="displayName"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter project description (optional)"
              value={formData.description}
              onChange={handleChange}
              maxLength={2000}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="submit" className="btn btn-save" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Project"}
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
