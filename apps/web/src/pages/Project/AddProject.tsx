import React, { useState } from "react";
import { api } from "../../services/api";
import "../Project/AddProject.css";

interface ProjectFormProps {
  initialData?: {
    prefix: string;
    displayName: string;
    description?: string;
  };
  onClose: () => void;
  onSave: (project: any) => void;
}

const ProjectForm = ({ initialData, onClose, onSave }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    prefix: initialData?.prefix || "",
    displayName: initialData?.displayName || "",
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
        name: formData.displayName,
        description: formData.description,
      };

      const result = await api.post("/projects", payload);
      console.log("result", result);
      const newProject = result.data.data;
      onSave(newProject);
      onClose();
    } catch (error) {
      console.log("Error creating project:", error);
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

          <div className="form-group">
            <label htmlFor="displayName">
              Project Name <span className="required">*</span>
            </label>
            <input
              id="displayName"
              type="text"
              name="displayName"
              placeholder="Enter project name"
              value={formData.displayName}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

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

          <div className="modal-actions">
            <button
              type="submit"
              className="btn btn-save"
              disabled={isSaving}
            >
              {isSaving ? (
                  "Saving..."
              ) : (
                "Save Project"
              )}
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