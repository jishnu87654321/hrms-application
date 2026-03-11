const prisma = require('../utils/prisma');

// GET /api/admin/me — full admin profile (user + adminDetail)
const getAdminProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id:        true,
        email:     true,
        fullName:  true,
        role:      true,
        createdAt: true,
        adminDetail: {
          select: {
            id:            true,
            phoneNumber:   true,
            officeAddress: true,
            permissions:   true,
            settings:      true,
            lastLoginIp:   true,
            createdAt:     true,
            updatedAt:     true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: 'Admin not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/me — update admin detail fields
const updateAdminProfile = async (req, res) => {
  try {
    const { phoneNumber, officeAddress, settings } = req.body;

    const updated = await prisma.adminDetail.upsert({
      where:  { userId: req.user.id },
      update: { phoneNumber, officeAddress, settings },
      create: {
        userId: req.user.id,
        phoneNumber,
        officeAddress,
        settings,
        permissions: ['MANAGE_EMPLOYEES'],
      },
    });

    res.json({ message: 'Profile updated', adminDetail: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAdminProfile, updateAdminProfile };
