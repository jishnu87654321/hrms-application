const { z } = require('zod');

const employeeSchema = z.object({
  fullName: z.coerce.string().min(2, 'Full name must be at least 2 characters'),
  role: z.coerce.string().min(2, 'Role is required'),
  employmentType: z.enum(['FULL_TIME', 'INTERN']),
  phoneNumber: z.coerce.string().min(10, 'Invalid phone number'),
  email: z.coerce.string().email('Invalid email address'),
  employeeCode: z.coerce.string().min(3, 'Employee code is required'),
  dateOfJoining: z.string().or(z.date()),
  departmentId: z.string().uuid('Invalid department ID'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = { employeeSchema, loginSchema };
