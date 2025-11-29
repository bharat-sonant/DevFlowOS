import { useEffect, useMemo, useState } from 'react'
import type { CompaniesResponseDto, CreateCompaniesDto, UpdateCompaniesDto } from '@om/shared'
import { api } from '../services/api'

type Props = {
  mode: 'create' | 'edit'
  initial?: CompaniesResponseDto
  onClose: () => void
  onCreate: (payload: CreateCompaniesDto) => Promise<void>
  onUpdate: (id: string, payload: UpdateCompaniesDto) => Promise<void>
}

type Form = {
  id?: string
  code: string
  name: string
  full_name?: string | null
  email: string
}

export default function CompanyFormModal({ mode, initial, onClose, onCreate, onUpdate }: Props) {
  const [form, setForm] = useState<Form>({ code: '', name: '', email: '', full_name: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeError, setCodeError] = useState("")

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setForm({
        id: initial.id,
        code: initial.code ?? '',
        name: initial.name ?? '',
        full_name: initial.full_name ?? '',
        email: initial.email ?? '',
      })
    }
  }, [mode, initial])

  const handleCodeBlur = async () => {
    if (!form.code?.trim()) return
    try {
      const { data } = await api.get(`/companies/check-code/${form.code}`, {
        params: form.id ? { excludeId: form.id } : {},
      })
      if (!data.available) {
        setCodeError("This company code is already taken")
      } else {
        setCodeError("")
      }
    } catch {
      setCodeError("Failed to validate code")
    }
  }

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Form, string>> = {}
    if (!form.code?.trim()) e.code = 'Code is required'
    if (!form.name?.trim()) e.name = 'Name is required'
    if (!form.email?.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (codeError) e.code = codeError
    return e
  }, [form, codeError])

  const invalid = (k: keyof Form) => touched[k] && errors[k]

  const submit = async () => {
    setTouched({ code: true, name: true, email: true })
    if (Object.keys(errors).length) return

    setSaving(true)
    setError(null)
    try {
      if (mode === 'create') {
        const payload: CreateCompaniesDto = {
          code: form.code.trim(),
          name: form.name.trim(),
          full_name: form.full_name?.trim() || null,
          email: form.email.trim(),
        }
        await onCreate(payload)
      } else if (mode === 'edit' && initial) {
        const payload: UpdateCompaniesDto = {
          code: form.code.trim(),
          name: form.name.trim(),
          full_name: form.full_name?.trim() || null,
          email: form.email.trim(),
        }
        await onUpdate(initial.id, payload)
      }
      onClose()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === 'create' ? 'Add Company' : 'Edit Company'}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Code</label>
                <input
                  type="text"
                  className={`form-control ${invalid('code') ? 'is-invalid' : ''}`}
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, code: true }))
                    handleCodeBlur()
                  }}
                />
                {invalid('code') && <div className="invalid-feedback">{errors.code}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className={`form-control ${invalid('name') ? 'is-invalid' : ''}`}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                />
                {invalid('name') && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Full name (optional)</label>
                <input
                  className="form-control"
                  value={form.full_name ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                />
              </div>

              <div className="mb-1">
                <label className="form-label">Email</label>
                <input
                  className={`form-control ${invalid('email') ? 'is-invalid' : ''}`}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                />
                {invalid('email') && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submit} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
