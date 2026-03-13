'use strict';
const prisma = require('../utils/prisma');

// ─── Department label map ────────────────────────────────────────────────────
// Normalise any raw team string → a clean display label used in charts.
// This ensures "HR", "Hr", "hr", "HUMAN_RESOURCES" all become "HR".
const DEPT_LABEL = {
  ENGINEERING:        'Engineering',
  HR:                 'HR',
  HUMAN_RESOURCES:    'HR',
  MARKETING:          'Marketing',
  SALES:              'Sales',
  FINANCE:            'Finance',
  OPERATIONS:         'Operations',
  OPS:                'Operations',
  DESIGN:             'Design',
  SUPPORT:            'Support',
  PRODUCT:            'Product',
  SPECIFIC:           'Specific',
  SOLID:              'Solid',
  SOPS:               'Sops',
  STUDENT_RELATED_BUS:'Student Related',
  OTHER:              'Other',
};

/**
 * Convert a raw team / department string → normalised display label.
 * Unknown values are bucketed under "Other".
 */
function normaliseDept(raw) {
  if (!raw || typeof raw !== 'string') return 'Other';
  const key = raw.trim().toUpperCase().replace(/[\s\-]+/g, '_');
  return DEPT_LABEL[key] || 'Other';
}

// ─── getStats ────────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const today        = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalEmployees,
      fullTimeCount,
      internCount,
      rawDeptGroups,
      recentJoins,
      newThisMonth,
    ] = await Promise.all([
      prisma.employee.count({ where: { isDeleted: false } }),

      prisma.employee.count({ where: { isDeleted: false, employmentType: 'FULL_TIME' } }),
      prisma.employee.count({ where: { isDeleted: false, employmentType: 'INTERN'    } }),

      // Pull every (team, count) bucket from the DB
      prisma.employee.groupBy({
        by: ['team'],
        _count: { id: true },
        where:  { isDeleted: false },
      }),

      prisma.employee.findMany({
        where:   { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      prisma.employee.count({
        where: { isDeleted: false, createdAt: { gte: startOfMonth } },
      }),
    ]);

    // ── Merge raw DB buckets into normalised labels ────────────────────────
    // e.g. both "HR" and "hr" in the DB collapse into the same "HR" label.
    const deptMap = new Map(); // label → count
    for (const row of rawDeptGroups) {
      const label = normaliseDept(row.team);
      deptMap.set(label, (deptMap.get(label) || 0) + row._count.id);
    }

    // Sort descending by count so the chart always shows largest bars first
    const departmentStats = Array.from(deptMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      totalEmployees,
      activeEmployees: totalEmployees, // no separate "active" flag yet
      fullTimeCount,
      internCount,
      newThisMonth,
      departmentStats,
      recentJoins,
    });
  } catch (error) {
    console.error('[getStats] error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── getAuditLogs ─────────────────────────────────────────────────────────────
const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true, email: true, role: true } } },
      take: 200,
    });
    res.json(logs);
  } catch (error) {
    console.error('[getAuditLogs] error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAuditLogs };
