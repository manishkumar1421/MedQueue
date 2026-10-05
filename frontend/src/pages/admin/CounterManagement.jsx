import React, { useState } from 'react';
import { Layers, Plus, Edit2, CheckCircle2, UserCheck, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { Modal } from '../../components/common/Modal';

export const CounterManagement = () => {
  const { counters, departments, addCounter, updateCounter } = useHospital();
  const [showModal, setShowModal] = useState(false);
  const [editingCounter, setEditingCounter] = useState(null);

  const [form, setForm] = useState({
    number: '',
    name: '',
    departmentId: departments[0]?.id || 'dept-1',
    departmentName: departments[0]?.name || 'Cardiology',
    assignedStaff: 'Pooja Verma (Receptionist)',
    status: 'Active'
  });

  const handleOpenAdd = () => {
    setEditingCounter(null);
    setForm({
      number: `Counter ${counters.length + 1}`,
      name: 'OPD Registration & Token Desk',
      departmentId: departments[0]?.id || 'dept-1',
      departmentName: departments[0]?.name || 'Cardiology',
      assignedStaff: 'Staff Member',
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCounter(c);
    setForm({ ...c });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selDept = departments.find((d) => d.id === form.departmentId);
    const payload = {
      ...form,
      departmentName: selDept ? selDept.name : form.departmentName
    };

    if (editingCounter) {
      updateCounter(editingCounter.id, payload);
    } else {
      addCounter(payload);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            OPD Registration Counters
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Configure hospital reception desks, staff assignments, and department queue routing
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Counter
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {counters.map((cnt) => (
          <div key={cnt.id} className="med-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Layers size={24} />
              </div>
              <span
                style={{
                  backgroundColor: cnt.status === 'Active' ? '#d1fae5' : '#fee2e2',
                  color: cnt.status === 'Active' ? '#065f46' : '#991b1b',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {cnt.status}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
              {cnt.number}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0.2rem 0 0.5rem' }}>
              {cnt.name}
            </h3>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                fontSize: '0.825rem',
                color: '#475569',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                marginBottom: '1.25rem'
              }}
            >
              <div>
                <strong>Department:</strong> {cnt.departmentName}
              </div>
              <div>
                <strong>Assigned Staff:</strong> {cnt.assignedStaff}
              </div>
              <div>
                <strong>Active Queue:</strong> ~{cnt.queueLength || 4} Patients
              </div>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleOpenEdit(cnt)}
              >
                <Edit2 size={13} />
                Reassign Counter
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingCounter ? `Edit Counter: ${editingCounter.number}` : 'Add Counter Desk'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Counter Number / Title <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="e.g. Counter 4 or Pediatric Counter"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Desk Functional Name</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Fast-Track Triage & Token Desk"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Department</label>
              <select
                className="form-control"
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Staff / Officer</label>
              <input
                type="text"
                className="form-control"
                value={form.assignedStaff}
                onChange={(e) => setForm({ ...form, assignedStaff: e.target.value })}
                placeholder="e.g. Pooja Verma (Receptionist)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operational Status</label>
              <select
                className="form-control"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCounter ? 'Save Changes' : 'Create Counter'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
