import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'ryzo-dev-secret';

function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { googleId, email, name, avatar, role } = req.body;

    if (!googleId || !email || !name || !role) {
      res.status(400).json({ error: 'Missing required fields: googleId, email, name, role' });
      return;
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({ googleId, email, name, avatar: avatar || '', role });
    }

    const token = generateToken(String(user._id));

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        integratedPlatforms: user.integratedPlatforms,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Authentication failed', details: message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const newToken = generateToken(String(user._id));
    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
