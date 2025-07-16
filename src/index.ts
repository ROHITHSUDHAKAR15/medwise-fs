import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import medicationsRouter from './medications';
import appointmentsRouter from './appointments';
import healthGoalsRouter from './healthGoals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());

// Rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/medications', medicationsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/health-goals', healthGoalsRouter);

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.get("/", (req: Request, res: Response) => {
  res.send("MedWise backend is running!");
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/users', authLimiter, async (req: Request, res: Response) => {
  const {
    email,
    password,
    name,
    age,
    gender,
    bloodType,
    emergencyContactName,
    emergencyContactRelationship,
    emergencyContactPhone
  } = req.body;

  // Email and password validation
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters, include uppercase, lowercase, and a number.' });
  }

  if (!email || !password || !name || !age || !gender || !bloodType || !emergencyContactName || !emergencyContactRelationship || !emergencyContactPhone) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        age: Number(age),
        gender,
        bloodType,
        emergencyContactName,
        emergencyContactRelationship,
        emergencyContactPhone
      }
    });
    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists.' });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

app.post('/login', authLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Reminder: In production, always use HTTPS and set secure cookies/headers.

// JWT auth middleware
function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    (req as any).user = user;
    next();
  });
}

// Admin middleware
function requireAdmin(req: Request, res: Response, next: Function) {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  prisma.user.findUnique({ where: { id: userId } })
    .then(user => {
      if (!user?.isAdmin) return res.status(403).json({ error: 'Admin only' });
      next();
    })
    .catch(() => res.status(500).json({ error: 'Server error' }));
}

// List all users (admin only)
app.get('/admin/users', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({ select: { password: false } });
  res.json(users);
});

// Delete user (admin only)
app.delete('/admin/users/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  try {
    await prisma.user.delete({ where: { id: userId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// Promote user to admin (admin only)
app.patch('/admin/users/:id/promote', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  try {
    const user = await prisma.user.update({ where: { id: userId }, data: { isAdmin: true } });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to promote user.' });
  }
});

// Example of a protected route:
// app.get('/protected', authenticateToken, (req, res) => {
//   res.json({ message: 'This is a protected route', user: (req as any).user });
// });

// Update user profile photo
app.patch('/users/:id/profile-photo', authenticateToken, async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Image URL is required.' });
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePhotoUrl: url }
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile photo.' });
  }
});

// Update medication prescription image
app.patch('/medications/:id/image', authenticateToken, async (req: Request, res: Response) => {
  const medId = Number(req.params.id);
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Image URL is required.' });
  try {
    const medication = await prisma.medication.update({
      where: { id: medId },
      data: { imageUrl: url }
    });
    res.json(medication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prescription image.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
