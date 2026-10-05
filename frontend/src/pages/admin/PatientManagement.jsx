import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const PatientManagement = () => {
  const { patients, addPatient, updatePatient, deactivatePatient } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewPatient, setViewPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '1995-01-01',
    age: 31,
    gender: 'Male',
    bloodGroup: 'B+',
    address: ''
  });

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile.includes(searchTerm) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchGender = genderFilter === 'all' ? true : p.gender === genderFilter;
    return matchSearch && matchStatus && matchGender;
  });

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setPatientForm({
      name: '',
      email: '',
      mobile: '',
      dob: '1995-01-01',
      age: 31,
      gender: 'Male',
      bloodGroup: 'B+',
      address: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPatient(p);
    setPatientForm({
      name: p.name,
      email: p.email || '',
      mobile: p.mobile,
      dob: p.dob || '1995-01-01',
      age: p.age || 30,
      gender: p.gender || 'Male',
      bloodGroup: p.bloodGroup || 'O+',
      address: p.address || ''
    });
    setShowAddModal(true);
  };

  const handleSubmitPatient = (e) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.mobile) {
      toast.error('Patient Name and Mobile are required');
      return;
    }

    if (editingPatient) {
      updatePatient(editingPatient.id, patientForm);
    } else {
      addPatient(patientForm);
    }
    setShowAddModal(false);
  };

  const handleConfirmDeactivate = () => {
    if (deactivateTarget) {
      deactivatePatient(deactivateTarget.id);
      setDeactivateTarget(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Patient Directory & Medical Records
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Manage {patients.length} registered hospital patients, active registrations, and demographic records
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <UserPlus size={16} />
          Add New Patient
        </button>
      </div>

      {/* Filter Bar */}
      <div className="med-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search by name, ID, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Patients Table */}
      <div className="med-card" style={{ padding: '1.5rem' }}>
        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Mobile Number</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Total Visits</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#64748b' }}>
                      {p.id.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{p.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.email}</div>
                  </td>
                  <td>{p.mobile}</td>
                  <td>{p.gender}</td>
                  <td>{p.age} yrs</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#ef4444' }}>{p.bloodGroup}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0284c7' }}>{p.totalVisits || 1} Visits</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: p.status === 'Active' ? '#d1fae5' : '#fee2e2',
                        color: p.status === 'Active' ? '#065f46' : '#991b1b'
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        title="View Details"
                        onClick={() => setViewPatient(p)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        title="Edit Patient"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: p.status === 'Active' ? '#ef4444' : '#10b981' }}
                        title={p.status === 'Active' ? 'Deactivate' : 'Activate'}
                        onClick={() => setDeactivateTarget(p)}
                      >
                        {p.status === 'Active' ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Patient Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingPatient ? 'Edit Patient Record' : 'Register New Patient'}
        >
          <form onSubmit={handleSubmitPatient}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                value={patientForm.name}
                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Mobile Number <span className="required">*</span></label>
                <input
                  type="tel"
                  className="form-control"
                  value={patientForm.mobile}
                  onChange={(e) => setPatientForm({ ...patientForm, mobile: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={patientForm.age}
                  onChange={(e) => setPatientForm({ ...patientForm, age: parseInt(e.target.value, 10) || 30 })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-control"
                  value={patientForm.bloodGroup}
                  onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                rows={2}
                className="form-control"
                value={patientForm.address}
                onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
              />
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingPatient ? 'Save Changes' : 'Create Patient'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Patient Details Modal */}
      {viewPatient && (
        <Modal
          isOpen={!!viewPatient}
          onClose={() => setViewPatient(null)}
          title={`Patient Dossier - ${viewPatient.name}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Patient ID</span>
                <strong style={{ display: 'block', color: '#0284c7' }}>{viewPatient.id.toUpperCase()}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Blood Group</span>
                <strong style={{ display: 'block', color: '#ef4444' }}>{viewPatient.bloodGroup}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Age & Gender</span>
                <strong style={{ display: 'block' }}>{viewPatient.age} yrs • {viewPatient.gender}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Status</span>
                <strong style={{ display: 'block', color: viewPatient.status === 'Active' ? '#059669' : '#dc2626' }}>
                  {viewPatient.status}
                </strong>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Contact Info</span>
              <div style={{ marginTop: '0.25rem' }}>📞 {viewPatient.mobile}</div>
              <div>✉️ {viewPatient.email || 'None on record'}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Residential Address</span>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#0f172a' }}>
                {viewPatient.address || 'Address not registered'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-primary" onClick={() => setViewPatient(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Deactivate / Activate Confirm Dialog */}
      {deactivateTarget && (
        <ConfirmDialog
          isOpen={!!deactivateTarget}
          onClose={() => setDeactivateTarget(null)}
          onConfirm={handleConfirmDeactivate}
          title={deactivateTarget.status === 'Active' ? 'Deactivate Patient' : 'Activate Patient'}
          message={`Are you sure you want to mark ${deactivateTarget.name} as ${deactivateTarget.status === 'Active' ? 'Inactive' : 'Active'}?`}
          confirmText="Yes, Proceed"
          isDanger={deactivateTarget.status === 'Active'}
        />
      )}
    </div>
  );
};
