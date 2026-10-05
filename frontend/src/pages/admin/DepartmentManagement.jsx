import React, { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, Search, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const DepartmentManagement = () => {
  const { departments, addDepartment, updateDepartment } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    name: '',
    code: 'M',
    description: '',
    head: '',
    room: 'Room 101-105',
    status: 'Active'
  });

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingDept(null);
    setForm({
      name: '',
      code: 'M',
      description: '',
      head: '',
      room: 'Room 101-105',
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setForm({ ...dept });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.head) {
      toast.error('Department Name and Head of Department are required');
      return;
    }
    if (editingDept) {
      updateDepartment(editingDept.id, form);
    } else {
      addDepartment(form);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Clinical Department Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Configure hospital divisions, clinical heads, assigned room wings, and token prefixes
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Department
        </button>
      </div>

      <div className="med-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search department or head..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>
      </div>

      <div className="med-card" style={{ padding: '1.5rem' }}>
        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Department Name</th>
                <th>Description</th>
                <th>Department Head</th>
                <th>OPD Rooms</th>
                <th>Specialists</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept) => (
                <tr key={dept.id}>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        backgroundColor: '#e0f2fe',
                        color: '#0284c7',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}
                    >
                      {dept.code || dept.name.charAt(0)}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{dept.name}</strong>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                      {dept.description}
                    </p>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{dept.head}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0284c7' }}>{dept.room}</span>
                  </td>
                  <td>
                    <span>{dept.assignedDoctors || 1} Doctors</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: dept.status === 'Active' ? '#d1fae5' : '#fee2e2',
                        color: dept.status === 'Active' ? '#065f46' : '#991b1b'
                      }}
                    >
                      {dept.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleOpenEdit(dept)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ef4444' }}
                        onClick={() => setDeleteTarget(dept)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingDept ? `Edit Department: ${editingDept.name}` : 'Create Clinical Department'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Department Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ophthalmology"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Token Code Prefix <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. OP"
                  maxLength={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department Head <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={form.head}
                  onChange={(e) => setForm({ ...form, head: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Rao"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Room Allocation</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  placeholder="e.g. Room 210-215"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Department Description</label>
              <textarea
                rows={3}
                className="form-control"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Clinical scope, diagnostic equipment, and outpatient services..."
              />
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingDept ? 'Update Department' : 'Create Department'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            toast.success(`Department ${deleteTarget.name} deactivated`);
            setDeleteTarget(null);
          }}
          title="Deactivate Department"
          message={`Are you sure you want to deactivate ${deleteTarget.name}?`}
          confirmText="Yes, Deactivate"
          isDanger={true}
        />
      )}
    </div>
  );
};
