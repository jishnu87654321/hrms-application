const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const { signToken } = require('../utils/jwt');

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`[AUTHLOGIN] Attempt for: ${email}`);

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(`[AUTHLOGIN] Successful for: ${email}`);
      res.json({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: signToken({ id: user.id, role: user.role })
      });
    } else {
      console.warn(`[AUTHLOGIN] Invalid credentials for: ${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`[AUTHLOGIN] DATABASE CRASH for ${email}:`, error);
    res.status(500).json({ 
      message: 'Prisma/Database initialization failed. Please check logs.',
      error: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { login, getMe };
