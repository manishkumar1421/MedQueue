import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { DoctorStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const DoctorManagement = () => {
  const { doctors, departments, addDoctor, updateDoctor, deleteDoctor } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: departments[0]?.id || 'dept-1',
    departmentName: departments[0]?.name || 'Cardiology',
    specialization: '',
    qualification: 'MBBS, MD',
    experience: '10 Years',
    roomNumber: '201',
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    maxPatients: 25,
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });

  const filtered = doctors.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.roomNumber.includes(searchTerm);
    const matchDept = deptFilter === 'all' ? true : doc.departmentId === deptFilter;
    const matchStatus = statusFilter === 'all' ? true : doc.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchDept && matchStatus;
  });

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      departmentId: departments[0]?.id || 'dept-1',
      departmentName: departments[0]?.name || 'Cardiology',
      specialization: '',
      qualification: 'MBBS, MD',
      experience: '10 Years',
      roomNumber: '201',
      startTime: '09:00 AM',
      endTime: '04:00 PM',
      maxPatients: 25,
      status: 'Available',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    });
    setShowModal(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingDoc(doc);
    setForm({ ...doc });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.specialization) {
      toast.error('Doctor Name and Specialization are required');
      return;
    }

    const selectedDept = departments.find((d) => d.id === form.departmentId);
    const docPayload = {
      ...form,
      departmentName: selectedDept ? selectedDept.name : form.departmentName
    };

    if (editingDoc) {
      updateDoctor(editingDoc.id, docPayload);
    } else {
      addDoctor(docPayload);
    }
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteDoctor(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Specialist Doctor Directory
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Configure clinical department assignments, OPD rooms, patient quotas, and consultation schedules
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Consultant Doctor
        </button>
      </div>

      {/* Filters Bar */}
      <div className="med-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search doctor name, specialization, room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="on leave">On Leave</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Doctor Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {filtered.map((doc) => (
          <div key={doc.id} className="med-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <img
                src={doc.avatar}
                alt={doc.name}
                style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {doc.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Star size={13} fill="#0284c7" /> {doc.rating}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
                  {doc.departmentName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {doc.specialization}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <DoctorStatusBadge status={doc.status} />
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                fontSize: '0.78rem',
                marginBottom: '1rem'
              }}
            >
              <div><strong>Room:</strong> Room {doc.roomNumber}</div>
              <div><strong>Max Quota:</strong> {doc.maxPatients} Patients</div>
              <div><strong>Experience:</strong> {doc.experience}</div>
              <div><strong>Hours:</strong> {doc.startTime}</div>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Days: <strong>{doc.availableDays.slice(0, 3).join(', ')}...</strong>
              </span>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenEdit(doc)}
                >
                  <Edit2 size={13} />
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#ef4444' }}
                  onClick={() => setDeleteTarget(doc)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Doctor Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingDoc ? `Edit Doctor: ${editingDoc.name}` : 'Add Specialist Doctor'}
          maxWidth="640px"
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Doctor Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dr. Alok Nath"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department <span className="required">*</span></label>
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
                <label className="form-label">Specialization <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  placeholder="e.g. Consultant Cardiologist"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qualifications</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.roomNumber}
                  onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Patients / Day</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.maxPatients}
                  onChange={(e) => setForm({ ...form, maxPatients: parseInt(e.target.value, 10) || 25 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">OPD Start Time</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">OPD End Time</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Availability Status</label>
                <select
                  className="form-control"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Experience</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingDoc ? 'Save Doctor Changes' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Doctor"
          message={`Are you sure you want to remove ${deleteTarget.name} from the medical registry?`}
          confirmText="Yes, Delete"
          isDanger={true}
        />
      )}
    </div>
  );
};
