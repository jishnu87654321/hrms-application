const { z } = require('zod');

const employeeSchema = z.object({
  employeeCode: z.string().trim().min(2, 'Employee code is required and must be at least 2 characters'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.union([
    z.literal(''),
    z.string().trim().toLowerCase().email('- Invalid email format')
  ]).optional(),
  phoneNumber: z.union([
    z.literal(''),
    z.string().trim().min(10, '- Phone number must be at least 10 digits')
  ]).optional(),
  role: z.string().trim().min(2, 'Role is required'),
  employmentType: z.enum(['FULL_TIME', 'INTERN', 'CONTRACT', 'TEMPORARY', 'CONSULTANT'], {
    errorMap: () => ({ message: 'Invalid employment type. Must be FULL_TIME, INTERN, etc.' })
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
