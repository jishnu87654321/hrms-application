const prisma = require('../utils/prisma');
const { employeeSchema } = require('../utils/validators');

const getAllEmployees = async (req, res) => {
  const { 
    search, 
    role, 
    type, 
    team, 
    sortBy = 'createdAt', 
    order = 'desc',
    page = 1,
    limit = 10
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {
    isDeleted: false,
    AND: [
      search ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { employeeCode: { contains: search, mode: 'insensitive' } },
        ]
      } : {},
      role ? { role } : {},
      type ? { employmentType: type } : {},
      team ? { team } : {},
    ]
  };

  try {
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take,
      }),
      prisma.employee.count({ where })
    ]);

    res.json({
      employees,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const validatedData = employeeSchema.parse(req.body);

    const existingEmail = await prisma.employee.findUnique({ where: { email: validatedData.email } });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

    const existingCode = await prisma.employee.findUnique({ where: { employeeCode: validatedData.employeeCode } });
    if (existingCode) return res.status(400).json({ message: 'Employee code already exists' });

    const employee = await prisma.employee.create({
      data: {
        ...validatedData,
        email: validatedData.email || null, // handle missing email nicely
        dateOfJoining: new Date(validatedData.dateOfJoining)
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        entity: 'EMPLOYEE',
        entityId: employee.id,
        details: employee
      }
    });

    res.status(201).json(employee);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({ where: { id: req.params.id } });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const validatedData = employeeSchema.parse(req.body);

    // Check for duplicates if changed
    if (validatedData.email !== employee.email) {
      const existingEmail = await prisma.employee.findUnique({ where: { email: validatedData.email } });
      if (existingEmail) return res.status(400).json({ message: 'Email already exists' });
    }

    if (validatedData.employeeCode !== employee.employeeCode) {
      const existingCode = await prisma.employee.findUnique({ where: { employeeCode: validatedData.employeeCode } });
      if (existingCode) return res.status(400).json({ message: 'Employee code already exists' });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: req.params.id },
      data: {
        ...validatedData,
        email: validatedData.email || null,
        dateOfJoining: new Date(validatedData.dateOfJoining)
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE',
        entity: 'EMPLOYEE',
        entityId: updatedEmployee.id,
        details: { before: employee, after: updatedEmployee }
      }
    });

    res.json(updatedEmployee);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({ where: { id: req.params.id } });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    await prisma.employee.update({
      where: { id: req.params.id },
      data: { isDeleted: true }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'DELETE',
        entity: 'EMPLOYEE',
        entityId: req.params.id,
        details: { employeeCode: employee.employeeCode }
      }
    });

    res.json({ message: 'Employee soft-deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDeletedEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { isDeleted: true }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreEmployee = async (req, res) => {
  try {
    await prisma.employee.update({
      where: { id: req.params.id },
      data: { isDeleted: false }
    });
    res.json({ message: 'Employee restored successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDeletedEmployees,
  restoreEmployee
};
