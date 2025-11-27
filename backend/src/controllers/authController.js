const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../../models'); // adjust path if needed

const register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const organisation = await Organisation.create({ name: orgName });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      organisationId: organisation.id,
      name: adminName,
      email,
      passwordHash: hash,
    });

    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // log
    await Log.create({
      organisationId: organisation.id,
      userId: user.id,
      action: 'organisation_created',
      meta: JSON.stringify({ organisationId: organisation.id }),
    });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, orgId: user.organisationId },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    await Log.create({
      organisationId: user.organisationId,
      userId: user.id,
      action: 'user_logged_in',
      meta: JSON.stringify({}),
    });

    res.json({ token, user: { id: user.id, name: user.name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
