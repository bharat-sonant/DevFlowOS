import { useEffect, useMemo, useState } from "react";
import { CompanyService } from "../services/company.service";
import type {
  CompaniesResponseDto,
  CreateCompaniesDto,
  UpdateCompaniesDto,
} from "@om/shared";
import CompanyFormModal from "../shared/CompanyFormModal";
import { useUI } from "../shared/UIContext";

type FormMode = { type: "create" } | { type: "edit"; row: CompaniesResponseDto };

export default function CompaniesPage() {
  const [rows, setRows] = useState<CompaniesResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<FormMode | null>(null);
  const [search, setSearch] = useState("");

  const { confirm, alert } = useUI();

  const load = async () => {
    try {
      setLoading(true);
      const data = await CompanyService.list();
      setRows(data);
    } catch (e: any) {
      alert("danger", e?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        (r.email?.toLowerCase() || "").includes(q)
    );
  }, [rows, search]);

  const onCreate = async (payload: CreateCompaniesDto) => {
    await CompanyService.create(payload);
    setModal(null);
    alert("success", "Company created successfully");
    await load();
  };

  const onUpdate = async (id: string, payload: UpdateCompaniesDto) => {
    await CompanyService.update(id, payload);
    setModal(null);
    alert("success", "Company updated successfully");
    await load();
  };

  const onDelete = async (id: string) => {
    const ok = await confirm({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this company?",
      confirmText: "Delete",
    });
    if (!ok) return;

    await CompanyService.remove(id);
    alert("success", "Company deleted successfully");
    await load();
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-3">
          <h5 className="m-0 flex-grow-1">Companies</h5>
          <input
            className="form-control w-auto"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => setModal({ type: "create" })}
          >
            + Add Company
          </button>
        </div>

        {loading && <div className="text-muted">Loading…</div>}

        {!loading && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 140 }}>Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td className="text-muted">{row.code}</td>
                    <td>
                      <div className="fw-medium">{row.name}</div>
                      {row.full_name && (
                        <div className="small text-muted">{row.full_name}</div>
                      )}
                    </td>
                    <td>{row.email}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setModal({ type: "edit", row })}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(row.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      No results
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <CompanyFormModal
          mode={modal.type}
          initial={modal.type === "edit" ? modal.row : undefined}
          onClose={() => setModal(null)}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
