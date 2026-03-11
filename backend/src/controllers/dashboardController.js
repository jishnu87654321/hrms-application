const prisma = require('../utils/prisma');

const getStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalEmployees,
      activeEmployees,
      fullTimeCount,
      internCount,
      departmentStats,
      recentJoins,
      newThisMonth
    ] = await Promise.all([
      prisma.employee.count({ where: { isDeleted: false } }),
      prisma.employee.count({ where: { isDeleted: false } }), // Using same as total for now since active status isn't separated
      prisma.employee.count({ where: { isDeleted: false, employmentType: 'FULL_TIME' } }),
      prisma.employee.count({ where: { isDeleted: false, employmentType: 'INTERN' } }),
      prisma.employee.groupBy({
        by: ['team'],
        _count: {
          id: true,
        },
        where: {
          isDeleted: false
        }
      }),
      prisma.employee.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.employee.count({
        where: { isDeleted: false, createdAt: { gte: startOfMonth } }
      })
    ]);

    res.json({
      totalEmployees,
      activeEmployees,
      fullTimeCount,
      internCount,
      newThisMonth,
      departmentStats: departmentStats.map(d => ({
        name: d.team,
        count: d._count.id
      })),
      recentJoins
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true, email: true } } },
      take: 100
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAuditLogs };
