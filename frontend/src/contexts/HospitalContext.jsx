import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  initialDepartments,
  initialDoctors,
  initialPatients,
  initialQueue,
  initialAppointments,
  initialCounters,
  initialNotifications,
  initialSettings,
  loadStore,
  saveStore
} from '../services/db';

const HospitalContext = createContext();

// Elegant soft hospital chime synthesized with Web Audio API
const playHospitalChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Classic two-tone hospital ding-dong
    playTone(587.33, 0.0, 0.4); // D5
    playTone(880.00, 0.25, 0.6); // A5
  } catch (e) {
    console.log('Audio playback not permitted or supported yet:', e);
  }
};

export const HospitalProvider = ({ children }) => {
  const [departments, setDepartments] = useState(() => loadStore('departments', initialDepartments));
  const [doctors, setDoctors] = useState(() => loadStore('doctors', initialDoctors));
  const [patients, setPatients] = useState(() => loadStore('patients', initialPatients));
  const [queue, setQueue] = useState(() => loadStore('queue', initialQueue));
  const [appointments, setAppointments] = useState(() => loadStore('appointments', initialAppointments));
  const [counters, setCounters] = useState(() => loadStore('counters', initialCounters));
  const [notifications, setNotifications] = useState(() => loadStore('notifications', initialNotifications));
  const [settings, setSettings] = useState(() => loadStore('settings', initialSettings));

  // Sync state changes to storage
  useEffect(() => { saveStore('departments', departments); }, [departments]);
  useEffect(() => { saveStore('doctors', doctors); }, [doctors]);
  useEffect(() => { saveStore('patients', patients); }, [patients]);
  useEffect(() => { saveStore('queue', queue); }, [queue]);
  useEffect(() => { saveStore('appointments', appointments); }, [appointments]);
  useEffect(() => { saveStore('counters', counters); }, [counters]);
  useEffect(() => { saveStore('notifications', notifications); }, [notifications]);
  useEffect(() => { saveStore('settings', settings); }, [settings]);

  // Priority comparator helper: Emergency > Senior Citizen > Normal
  const getPriorityWeight = useCallback((priority) => {
    if (priority === 'Emergency') return 1;
    if (priority === 'Senior Citizen') return 2;
    return 3;
  }, []);

  // Calculate dynamic wait time and queue statistics for any token
  const getQueueStatsForToken = useCallback((tokenNumber, doctorId) => {
    const docQueue = queue.filter(
      (q) => (doctorId ? q.doctorId === doctorId : true) && q.status !== 'Completed' && q.status !== 'Cancelled'
    );

    const activeItem = docQueue.find((q) => q.tokenNumber === tokenNumber);
    if (!activeItem) {
      return {
        currentServing: docQueue.find((q) => q.status === 'In Consultation' || q.status === 'Called') || null,
        patientsAhead: 0,
        estimatedWait: 0,
        status: 'Not In Active Queue',
        queuePosition: '-'
      };
    }

    const currentServing = docQueue.find((q) => q.status === 'In Consultation' || q.status === 'Called') || null;

    // Filter waiting items ahead based on priority and queue order
    const waitingItems = docQueue.filter((q) => q.status === 'Waiting');
    const sortedWaiting = [...waitingItems].sort((a, b) => {
      const pDiff = getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
      if (pDiff !== 0) return pDiff;
      return a.id.localeCompare(b.id);
    });

    const indexInWaiting = sortedWaiting.findIndex((q) => q.tokenNumber === tokenNumber);
    const hasServingAhead = currentServing && currentServing.tokenNumber !== tokenNumber ? 1 : 0;
    
    let patientsAhead = 0;
    if (activeItem.status === 'In Consultation' || activeItem.status === 'Called') {
      patientsAhead = 0;
    } else if (indexInWaiting >= 0) {
      patientsAhead = indexInWaiting + hasServingAhead;
    }

    const estimatedWait = patientsAhead * (settings.avgConsultationTime || 10);

    return {
      currentServing,
      patientsAhead,
      estimatedWait,
      status: activeItem.status,
      queuePosition: patientsAhead + 1,
      item: activeItem
    };
  }, [queue, settings.avgConsultationTime, getPriorityWeight]);

  // Add in-app Notification
  const addNotification = useCallback((note) => {
    const newNote = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...note
    };
    setNotifications((prev) => [newNote, ...prev]);
  }, []);

  // Mark notification read
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  }, []);

  // Core Queue Action: CALL NEXT PATIENT
  const callNextPatient = useCallback((doctorId) => {
    setQueue((prevQueue) => {
      // Find currently serving patient for this doctor
      const currentServing = prevQueue.find(
        (q) => q.doctorId === doctorId && (q.status === 'Called' || q.status === 'In Consultation')
      );

      // Find waiting patients for this doctor
      const waitingPatients = prevQueue.filter(
        (q) => q.doctorId === doctorId && q.status === 'Waiting'
      );

      if (waitingPatients.length === 0) {
        toast('No more waiting patients for this doctor queue!', { icon: 'ℹ️' });
        return prevQueue;
      }

      // Sort by priority (Emergency first, then Senior Citizen, then token/order)
      const sortedWaiting = [...waitingPatients].sort((a, b) => {
        const pA = getPriorityWeight(a.priority);
        const pB = getPriorityWeight(b.priority);
        if (pA !== pB) return pA - pB;
        return a.id.localeCompare(b.id);
      });

      const nextPatient = sortedWaiting[0];
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update queue
      const updatedQueue = prevQueue.map((item) => {
        if (currentServing && item.id === currentServing.id) {
          return {
            ...item,
            status: 'Completed',
            completedAt: nowTime
          };
        }
        if (item.id === nextPatient.id) {
          return {
            ...item,
            status: 'Called',
            calledAt: nowTime
          };
        }
        return item;
      });

      // Update appointments table as well
      setAppointments((prevAppts) =>
        prevAppts.map((appt) => {
          if (currentServing && appt.tokenNumber === currentServing.tokenNumber) {
            return { ...appt, status: 'Completed' };
          }
          if (appt.tokenNumber === nextPatient.tokenNumber) {
            return { ...appt, status: 'Called' };
          }
          return appt;
        })
      );

      // Play chime
      playHospitalChime();

      // Trigger user alerts
      toast.success(`Token ${nextPatient.tokenNumber} (${nextPatient.patientName}) CALLED to Room ${nextPatient.roomNumber}!`, {
        icon: '📢',
        duration: 4000
      });

      addNotification({
        title: 'Token Called!',
        message: `Token ${nextPatient.tokenNumber} (${nextPatient.patientName}) called for ${nextPatient.doctorName} in Room ${nextPatient.roomNumber}.`,
        type: 'queue',
        role: 'Patient',
        targetUserId: nextPatient.patientId
      });

      return updatedQueue;
    });
  }, [getPriorityWeight, addNotification]);

  // Start Consultation
  const startConsultation = useCallback((queueId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setQueue((prev) =>
      prev.map((item) =>
        item.id === queueId
          ? { ...item, status: 'In Consultation', consultationStartedAt: nowTime }
          : item
      )
    );
    setAppointments((prev) =>
      prev.map((appt) => {
        const qItem = queue.find((q) => q.id === queueId);
        return qItem && appt.tokenNumber === qItem.tokenNumber
          ? { ...appt, status: 'In Consultation' }
          : appt;
      })
    );
    toast.success('Consultation started');
  }, [queue]);

  // Complete Consultation
  const completeConsultation = useCallback((queueId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Find item BEFORE updating state to avoid stale closure
    const completedItem = queue.find((item) => item.id === queueId);
    setQueue((prev) =>
      prev.map((item) =>
        item.id === queueId
          ? { ...item, status: 'Completed', completedAt: nowTime }
          : item
      )
    );
    if (completedItem) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.tokenNumber === completedItem.tokenNumber
            ? { ...appt, status: 'Completed' }
            : appt
        )
      );
      toast.success(`Consultation completed for Token ${completedItem.tokenNumber}`);
    }
  }, [queue]);

  // Skip Patient
  const skipPatient = useCallback((queueId) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === queueId ? { ...item, status: 'Skipped' } : item
      )
    );
    toast('Patient skipped and moved to skipped list', { icon: '⏭️' });
  }, []);

  // Put on Hold
  const holdPatient = useCallback((queueId) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === queueId ? { ...item, status: 'On Hold' } : item
      )
    );
    toast('Patient placed on hold', { icon: '⏸️' });
  }, []);

  // Resume or Rejoin Queue
  const rejoinQueue = useCallback((queueId) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === queueId ? { ...item, status: 'Waiting' } : item
      )
    );
    toast.success('Patient rejoined active waiting queue');
  }, []);

  // Cancel Token
  const cancelQueueToken = useCallback((queueId, reason = 'Cancelled by staff') => {
    // Find item BEFORE updating state to avoid stale closure
    const qItem = queue.find((q) => q.id === queueId);
    setQueue((prev) =>
      prev.map((item) =>
        item.id === queueId
          ? { ...item, status: 'Cancelled', cancelReason: reason }
          : item
      )
    );
    if (qItem) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.tokenNumber === qItem.tokenNumber
            ? { ...appt, status: 'Cancelled' }
            : appt
        )
      );
    }
    toast.error('Token cancelled');
  }, [queue]);

  // Book an Appointment (generates sequential token, adds to appointments & queue)
  const bookAppointment = useCallback((bookingData) => {
    const dept = departments.find((d) => d.id === bookingData.departmentId);
    const doc = doctors.find((d) => d.id === bookingData.doctorId);

    if (!dept || !doc) {
      toast.error('Invalid department or doctor selection');
      return null;
    }

    const deptCode = dept.code || 'M';
    // Count existing tokens today for this department to generate next sequential number
    const countToday = queue.filter((q) => q.departmentId === dept.id).length + 1;
    const tokenNumber = `${deptCode}-${String(countToday + 18).padStart(3, '0')}`;

    const newQueueItem = {
      id: `q-${Date.now()}`,
      tokenNumber,
      patientId: bookingData.patientId || `pat-${Date.now().toString().slice(-4)}`,
      patientName: bookingData.patientName,
      patientAge: bookingData.patientAge || 30,
      patientGender: bookingData.patientGender || 'Male',
      patientMobile: bookingData.patientMobile,
      doctorId: doc.id,
      doctorName: doc.name,
      departmentId: dept.id,
      departmentName: dept.name,
      roomNumber: doc.roomNumber,
      appointmentTime: bookingData.timeSlot,
      status: 'Waiting',
      priority: bookingData.priority || 'Normal',
      appointmentType: bookingData.appointmentType || 'Online Appointment',
      reasonForVisit: bookingData.reason || 'General Health Consultation',
      date: bookingData.date
    };

    const newAppt = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      patientId: newQueueItem.patientId,
      patientName: newQueueItem.patientName,
      doctorId: doc.id,
      doctorName: doc.name,
      departmentId: dept.id,
      departmentName: dept.name,
      tokenNumber,
      date: bookingData.date,
      time: bookingData.timeSlot,
      room: doc.roomNumber,
      type: bookingData.appointmentType || 'Online Appointment',
      status: 'Waiting',
      reason: bookingData.reason || 'General Health Consultation',
      createdAt: new Date().toISOString()
    };

    setQueue((prev) => [...prev, newQueueItem]);
    setAppointments((prev) => [newAppt, ...prev]);

    addNotification({
      title: 'Appointment Booked!',
      message: `Your token ${tokenNumber} for ${doc.name} (${dept.name}) is confirmed. Room: ${doc.roomNumber}`,
      type: 'appointment',
      role: 'Patient',
      targetUserId: newQueueItem.patientId
    });

    toast.success(`Appointment Confirmed! Token: ${tokenNumber}`, {
      duration: 5000,
      icon: '🎫'
    });

    return { tokenNumber, appointment: newAppt, queueItem: newQueueItem };
  }, [departments, doctors, queue, addNotification]);

  // Register Walk-In Patient
  const registerWalkIn = useCallback((walkInData) => {
    const dept = departments.find((d) => d.id === walkInData.departmentId);
    const doc = doctors.find((d) => d.id === walkInData.doctorId);

    if (!dept || !doc) {
      toast.error('Please select both department and doctor');
      return null;
    }

    const deptCode = dept.code || 'W';
    const countToday = queue.filter((q) => q.departmentId === dept.id).length + 1;
    const tokenNumber = `${deptCode}-${String(countToday + 20).padStart(3, '0')}`;

    const newPatientId = `pat-${Date.now().toString().slice(-4)}`;
    const newPatient = {
      id: newPatientId,
      name: walkInData.patientName,
      email: walkInData.email || `${walkInData.patientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      mobile: walkInData.mobile,
      age: parseInt(walkInData.age, 10) || 35,
      gender: walkInData.gender || 'Other',
      bloodGroup: walkInData.bloodGroup || 'O+',
      address: walkInData.address || 'Walk-in Patient, Hospital Desk',
      status: 'Active',
      totalVisits: 1,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    setPatients((prev) => [newPatient, ...prev]);

    const newQueueItem = {
      id: `q-${Date.now()}`,
      tokenNumber,
      patientId: newPatientId,
      patientName: walkInData.patientName,
      patientAge: newPatient.age,
      patientGender: newPatient.gender,
      patientMobile: walkInData.mobile,
      doctorId: doc.id,
      doctorName: doc.name,
      departmentId: dept.id,
      departmentName: dept.name,
      roomNumber: doc.roomNumber,
      appointmentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Waiting',
      priority: walkInData.priority || 'Normal', // Normal, Senior Citizen, Emergency
      appointmentType: 'Walk-in',
      reasonForVisit: walkInData.reason || 'OPD Walk-in consultation',
      date: new Date().toISOString().split('T')[0]
    };

    const newAppt = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      patientId: newPatientId,
      patientName: walkInData.patientName,
      doctorId: doc.id,
      doctorName: doc.name,
      departmentId: dept.id,
      departmentName: dept.name,
      tokenNumber,
      date: new Date().toISOString().split('T')[0],
      time: newQueueItem.appointmentTime,
      room: doc.roomNumber,
      type: 'Walk-in',
      status: 'Waiting',
      reason: walkInData.reason || 'OPD Walk-in consultation',
      createdAt: new Date().toISOString()
    };

    setQueue((prev) => {
      // If Emergency, place right behind the currently serving token
      if (walkInData.priority === 'Emergency') {
        const servingIdx = prev.findIndex(
          (q) => q.doctorId === doc.id && (q.status === 'In Consultation' || q.status === 'Called')
        );
        if (servingIdx >= 0) {
          const nextQ = [...prev];
          nextQ.splice(servingIdx + 1, 0, newQueueItem);
          return nextQ;
        }
      }
      return [...prev, newQueueItem];
    });

    setAppointments((prev) => [newAppt, ...prev]);

    toast.success(`Walk-in registered! Token: ${tokenNumber}`, {
      icon: '🚨'
    });

    return { tokenNumber, patient: newPatient, queueItem: newQueueItem };
  }, [departments, doctors, queue]);

  // Admin Queue Control
  const pauseDepartmentQueue = useCallback((deptId) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === deptId ? { ...d, queuePaused: !d.queuePaused } : d))
    );
    toast.success('Department queue status updated');
  }, []);

  const resetDepartmentQueue = useCallback((deptId) => {
    setQueue((prev) => prev.filter((q) => q.departmentId !== deptId));
    toast.success('Department queue has been reset');
  }, []);

  // Update Settings
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    toast.success('Hospital settings updated successfully');
  }, []);

  // Reset Everything to Rich Demo Data
  const resetToDemoData = useCallback(() => {
    setDepartments(initialDepartments);
    setDoctors(initialDoctors);
    setPatients(initialPatients);
    setQueue(initialQueue);
    setAppointments(initialAppointments);
    setCounters(initialCounters);
    setNotifications(initialNotifications);
    setSettings(initialSettings);
    toast.success('Demo data restored to initial state');
  }, []);

  // CRUD helpers for Admin
  const addDoctor = useCallback((docData) => {
    const newDoc = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      rating: 4.8,
      status: 'Available',
      ...docData
    };
    setDoctors((prev) => [newDoc, ...prev]);
    toast.success(`Doctor ${docData.name} added successfully`);
  }, []);

  const updateDoctor = useCallback((id, docData) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...docData } : d)));
    toast.success('Doctor details updated');
  }, []);

  const deleteDoctor = useCallback((id) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    toast.success('Doctor removed');
  }, []);

  const addPatient = useCallback((patData) => {
    const newPat = {
      id: `pat-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      totalVisits: 1,
      registeredDate: new Date().toISOString().split('T')[0],
      ...patData
    };
    setPatients((prev) => [newPat, ...prev]);
    toast.success(`Patient ${patData.name} created`);
  }, []);

  const updatePatient = useCallback((id, patData) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patData } : p)));
    toast.success('Patient details updated');
  }, []);

  const deactivatePatient = useCallback((id) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p))
    );
    toast.success('Patient status updated');
  }, []);

  const addDepartment = useCallback((deptData) => {
    const newDept = {
      id: `dept-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      assignedDoctors: 0,
      ...deptData
    };
    setDepartments((prev) => [...prev, newDept]);
    toast.success(`Department ${deptData.name} created`);
  }, []);

  const updateDepartment = useCallback((id, deptData) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...deptData } : d)));
    toast.success('Department updated');
  }, []);

  const addCounter = useCallback((counterData) => {
    const newCounter = {
      id: `cnt-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      queueLength: 0,
      ...counterData
    };
    setCounters((prev) => [...prev, newCounter]);
    toast.success(`Counter ${counterData.number} added`);
  }, []);

  const updateCounter = useCallback((id, counterData) => {
    setCounters((prev) => prev.map((c) => (c.id === id ? { ...c, ...counterData } : c)));
    toast.success('Counter updated');
  }, []);

  return (
    <HospitalContext.Provider
      value={{
        departments,
        doctors,
        patients,
        queue,
        appointments,
        counters,
        notifications,
        settings,
        getQueueStatsForToken,
        callNextPatient,
        startConsultation,
        completeConsultation,
        skipPatient,
        holdPatient,
        rejoinQueue,
        cancelQueueToken,
        bookAppointment,
        registerWalkIn,
        pauseDepartmentQueue,
        resetDepartmentQueue,
        updateSettings,
        resetToDemoData,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addPatient,
        updatePatient,
        deactivatePatient,
        addDepartment,
        updateDepartment,
        addCounter,
        updateCounter
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
