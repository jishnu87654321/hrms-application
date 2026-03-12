const { z } = require('zod');

const employeeSchema = z.object({
  employeeCode: z.string().trim().min(2, 'Employee code is required and must be at least 2 characters'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : val),
    z.string().trim().toLowerCase().email('Invalid email format').nullable()
  ).optional(),
  // Prisma schema has phoneNumber as non-nullable String, so we store '' if missing
  phoneNumber: z.preprocess(
    (val) => (val === null || val === undefined ? '' : String(val).trim()),
    z.string()
  ),
  role: z.string().trim().min(2, 'Role is required'),
  // Prisma EmploymentType enum only has FULL_TIME and INTERN
  employmentType: z.enum(['FULL_TIME', 'INTERN'], {
    errorMap: () => ({ message: 'Invalid employment type. Must be FULL_TIME or INTERN.' })
  }),
  team: z.string().trim().min(2, 'Team is required').toUpperCase(),
  dateOfJoining: z.date({
    errorMap: () => ({ message: 'Invalid date of joining' }),
  }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = { employeeSchema, loginSchema };
