// backend/src/controllers/logController.js
const { Log, User } = require('../../models');

const listLogs = async (req, res) => {
  try {
    // only logs of same organisation
    const logs = await Log.findAll({
      where: { organisationId: req.user.orgId },
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']] // latest first
    });

    res.json(logs);
  } catch (err) {
    console.error('listLogs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listLogs };
