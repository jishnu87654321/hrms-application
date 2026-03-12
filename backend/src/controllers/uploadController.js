'use strict';

const fs   = require('fs');
const csv  = require('csv-parser');
const prisma = require('../utils/prisma');

// ─────────────────────────────────────────────────────────────────────────────
// FIELD HANDLING RULES (applied to every row before DB insert)
//
//  employeeCode   → REQUIRED. Skip row if missing.
//  fullName       → non-nullable String  → fallback "-"
//  role           → non-nullable String  → fallback "-"
//  team           → non-nullable String  → fallback "OTHER"  (has DB default)
//  employmentType → enum, non-nullable   → fallback FULL_TIME (has DB default)
//  phoneNumber    → nullable String?     → null if missing
//  email          → nullable String?     → null if missing / invalid
//  dateOfJoining  → nullable DateTime?   → null if missing / unparseable
// ─────────────────────────────────────────────────────────────────────────────

/** Trim a value; return '' for null / undefined / NaN. */
function safeStr(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number' && isNaN(v)) return '';
  return String(v).trim();
}

/** Return null instead of empty string — for nullable DB fields. */
function nullIfEmpty(v) {
  const s = safeStr(v);
  return s === '' ? null : s;
}

/** Parse an email; return null if missing or badly formatted. */
function parseEmail(v) {
  const s = safeStr(v).toLowerCase();
  if (!s) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : null;
}

/** Parse a phone number; return null if missing. */
function parsePhone(v) {
  const s = safeStr(v);
  return s === '' ? null : s;
}

/**
 * Parse a date from an Excel serial number or a date string.
 * Returns null (not a fallback date) if the value is missing/unparseable.
 */
function parseDate(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') {
    const d = new Date(Math.round((v - 25569) * 86400 * 1000));
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Map raw employment-type string → valid Prisma EmploymentType enum value.
 * Prisma schema allows: FULL_TIME | INTERN
 */
function parseEmploymentType(v) {
  const s = safeStr(v).toUpperCase().replace(/[\s\-]+/g, '_');
  return ['INTERN', 'INTERNSHIP', 'TRAINEE', 'APPRENTICE'].includes(s)
    ? 'INTERN'
    : 'FULL_TIME';
}

/**
 * Map raw team string → valid team value (stored as plain String in DB).
 * Falls back to "OTHER".
 */
function parseTeam(v) {
  if (!v || safeStr(v) === '') return 'OTHER';
  const s = safeStr(v).toUpperCase().replace(/[\s\-]+/g, '_');
  const valid = [
    'ENGINEERING', 'HR', 'MARKETING', 'SALES', 'FINANCE',
    'OPERATIONS', 'DESIGN', 'SUPPORT', 'PRODUCT', 'SPECIFIC',
    'SOLID', 'SOPS', 'STUDENT_RELATED_BUS', 'OTHER',
  ];
  return valid.includes(s) ? s : 'OTHER';
}

/**
 * Build a Prisma-compatible Employee record from a raw import row.
 *
 * Returns null if employeeCode is missing (row should be skipped).
 * Never throws — all other missing fields receive safe defaults.
 */
function buildRecord(row) {
  // ── employeeCode: the ONLY truly required field ──────────────────────────
  const employeeCode = safeStr(
    row.employeeCode || row['Emp No.'] || row['emp_no'] || row['id'] || ''
  );
  if (!employeeCode) return null; // caller should skip this row

  // ── Non-nullable string fields (DB constraint) ───────────────────────────
  const fullName = safeStr(row.fullName || row['Name'] || '') || '-';
  const role     = safeStr(row.role     || row['Role'] || '') || '-';
  const team     = parseTeam(row.team   || row['Team'] || row.department || '');

  // ── Enum with DB default ─────────────────────────────────────────────────
  const employmentType = parseEmploymentType(
    row.employmentType || row['Type of Employment'] || ''
  );

  // ── Nullable fields (schema: String? / DateTime?) ────────────────────────
  const email         = parseEmail(row.email || row['Email'] || '');
  const phoneNumber   = parsePhone(row.phoneNumber || row['Contact Num'] || '');
  const dateOfJoining = parseDate(row.dateOfJoining || row['DOJ'] || '');

  return {
    employeeCode,
    fullName,
    role,
    team,
    employmentType,
    email,           // null or valid email string
    phoneNumber,     // null or string
    dateOfJoining,   // null or Date
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared DB + Audit helper — called after processing any import source
// ─────────────────────────────────────────────────────────────────────────────
async function persistImport({ records, errors, totalRows, fileName, userId, duplicatesSkipped = 0 }) {
  let insertedCount = 0;

  if (records.length > 0) {
    const result = await prisma.employee.createMany({
      data: records,
      skipDuplicates: true,
    });
    insertedCount = result.count;
  }

  const successCount = insertedCount;
  const failedCount  = errors.length;

  const uploadLog = await prisma.uploadLog.create({
    data: {
      fileName,
      status: failedCount === 0 ? 'SUCCESS' : 'PARTIAL_SUCCESS',
      totalRows,
      successCount,
      failedCount,
      errorReport: { errors, duplicatesSkipped },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action:   'BULK_UPLOAD',
      entity:   'EMPLOYEE',
      entityId: uploadLog.id,
      details:  { successCount, failedCount, duplicatesSkipped, totalRows },
    },
  });

  return { totalRows, successCount, failedCount, duplicatesSkipped, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /upload/bulk  — CSV / multipart file upload
// ─────────────────────────────────────────────────────────────────────────────
const bulkUploadEmployees = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const rawRows  = [];
  const errors   = [];
  const records  = [];
  let   skippedNoCode = 0;

  const stream = fs.createReadStream(req.file.path).pipe(csv());

  stream.on('data', row => rawRows.push(row));

  stream.on('end', async () => {
    for (let i = 0; i < rawRows.length; i++) {
      const record = buildRecord(rawRows[i]);
      if (!record) {
        skippedNoCode++;
        errors.push({ row: i + 2, error: 'Missing employeeCode — row skipped', data: rawRows[i] });
        continue;
      }
      records.push(record);
    }

    try {
      const summary = await persistImport({
        records,
        errors,
        totalRows: rawRows.length,
        fileName:  req.file.originalname,
        userId:    req.user.id,
        duplicatesSkipped: skippedNoCode,
      });

      fs.unlinkSync(req.file.path);
      res.json({ message: 'Upload processed', summary, errors: errors.slice(0, 100) });
    } catch (dbErr) {
      console.error('[BulkUpload CSV] DB error:', dbErr);
      res.status(500).json({ message: 'Database error during bulk insert', error: dbErr.message, detail: dbErr.meta || null });
    }
  });

  stream.on('error', err => {
    console.error('[BulkUpload CSV] Parse error:', err);
    res.status(500).json({ message: 'Error parsing CSV file' });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /upload/json  — JSON payload from the frontend Excel parser
// ─────────────────────────────────────────────────────────────────────────────
const bulkUploadJson = async (req, res) => {
  try {
    const { employees, fileName } = req.body;

    if (!employees || !Array.isArray(employees)) {
      return res.status(400).json({ message: 'Invalid payload: employees array required' });
    }

    // ── Load existing identifiers for duplicate detection ─────────────────
    const existing = await prisma.employee.findMany({
      select: { email: true, employeeCode: true },
    });
    const existingEmails = new Set(
      existing.filter(e => e.email).map(e => e.email.toLowerCase())
    );
    const existingCodes = new Set(
      existing.map(e => e.employeeCode.toLowerCase())
    );

    const records = [];
    const errors  = [];
    let skippedNoCode    = 0;
    let duplicatesSkipped = 0;

    for (let i = 0; i < employees.length; i++) {
      const row = employees[i];

      const record = buildRecord(row);

      // ── Row has no employeeCode: skip ────────────────────────────────────
      if (!record) {
        skippedNoCode++;
        errors.push({ row: i + 2, error: 'Missing employeeCode — row skipped', data: { raw: '(no code)' } });
        continue;
      }

      const codeKey  = record.employeeCode.toLowerCase();
      const emailKey = record.email ? record.email.toLowerCase() : null;

      // ── Duplicate check against DB + current batch ───────────────────────
      if (existingCodes.has(codeKey) || (emailKey && existingEmails.has(emailKey))) {
        duplicatesSkipped++;
        continue;
      }

      // Mark as seen so within-batch dup doesn't insert twice
      existingCodes.add(codeKey);
      if (emailKey) existingEmails.add(emailKey);

      records.push(record);
    }

    const summary = await persistImport({
      records,
      errors,
      totalRows: employees.length,
      fileName:  fileName || 'bulk_upload',
      userId:    req.user.id,
      duplicatesSkipped: duplicatesSkipped + skippedNoCode,
    });

    res.json({
      message: 'Upload processed',
      summary,
      errors: errors.slice(0, 100),
    });

  } catch (err) {
    console.error('[BulkUpload JSON] Unexpected error:', err);
    res.status(500).json({
      message: 'Error processing bulk upload',
      error:   err.message,
      detail:  err.meta || null,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /upload/logs
// ─────────────────────────────────────────────────────────────────────────────
const getUploadLogs = async (req, res) => {
  try {
    const logs = await prisma.uploadLog.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /upload/template  — Download sample XLSX
// ─────────────────────────────────────────────────────────────────────────────
const downloadTemplate = (req, res) => {
  const xlsx = require('xlsx');
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet([
    ['Emp No.', 'Name', 'Role', 'Type of Employment', 'DOJ', 'Team', 'Contact Num', 'Email'],
    ['EMP001', 'John Doe',   'Developer', 'FULL_TIME', '2023-01-01', 'Engineering', '9876543210', 'john@example.com'],
    ['EMP002', 'Jane Smith', 'Intern',    'INTERN',    '2023-02-15', 'Design',      '9123456780', 'jane@example.com'],
    ['EMP003', 'Sam Raju',   'Analyst',   'FULL_TIME', '2024-06-01', 'Operations',  '',           ''],
  ]);
  xlsx.utils.book_append_sheet(wb, ws, 'Employees');
  const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=employee_template.xlsx');
  res.status(200).send(buf);
};

module.exports = { bulkUploadEmployees, bulkUploadJson, getUploadLogs, downloadTemplate };
