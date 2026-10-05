const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// ── Generate JWT ───────────────────────────────────────────────────────────────
const generateToken = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email, mobile: user.mobile, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ── REGISTER ───────────────────────────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Validate
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required: name, email, mobile, password' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check existing
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR mobile = ?',
      [email.toLowerCase(), mobile]
    );
    if (existing.length > 0) {
      const conflict = existing[0].email === email.toLowerCase() ? 'Email' : 'Mobile number';
      return res.status(409).json({ success: false, message: `${conflict} is already registered` });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create unique ID
    const userId = `pat-${Date.now().toString().slice(-8)}`;

    // Insert
    await pool.query(
      `INSERT INTO users (id, name, email, mobile, password_hash, role, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'Patient', 'Active', NOW())`,
      [userId, name.trim(), email.toLowerCase().trim(), mobile.trim(), passwordHash]
    );

    // Fetch the created user
    const [rows] = await pool.query('SELECT id, name, email, mobile, role, status FROM users WHERE id = ?', [userId]);
    const user = rows[0];

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: `Welcome to MedQueue, ${user.name}!`,
      token,
      user
    });
  } catch (err) {
    console.error('[register error]', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ── LOGIN ──────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Accepts email OR mobile number
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/mobile and password are required' });
    }

    // Find user by email OR mobile
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR mobile = ? LIMIT 1',
      [identifier.toLowerCase().trim(), identifier.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email/mobile or password' });
    }

    const user = rows[0];

    // Check account status
    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact hospital admin.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email/mobile or password' });
    }

    // Generate token
    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);

    // Update last visit (optional)
    await pool.query('UPDATE users SET total_visits = total_visits + 1 WHERE id = ?', [user.id]);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('[login error]', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ── GET CURRENT USER ───────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, mobile, role, gender, dob, blood_group, address, status, total_visits, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('[getMe error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── UPDATE PROFILE ─────────────────────────────────────────────────────────────
// PUT /api/auth/profile (protected)
const updateProfile = async (req, res) => {
  try {
    const { name, mobile, gender, dob, blood_group, address } = req.body;
    await pool.query(
      'UPDATE users SET name=?, mobile=?, gender=?, dob=?, blood_group=?, address=? WHERE id=?',
      [name, mobile, gender, dob || null, blood_group, address, req.user.id]
    );
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('[updateProfile error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login, getMe, updateProfile };
