import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all health goals
router.get('/', async (req: Request, res: Response) => {
  const healthGoals = await prisma.healthGoal.findMany();
  res.json(healthGoals);
});

// Get health goal by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const healthGoal = await prisma.healthGoal.findUnique({ where: { id } });
  if (!healthGoal) return res.status(404).json({ error: 'Not found' });
  res.json(healthGoal);
});

// Create health goal
router.post('/', async (req: Request, res: Response) => {
  const { userId, title, description, targetDate, achieved } = req.body;
  if (!userId || !title || !description || !targetDate) {
    return res.status(400).json({ error: 'userId, title, description, and targetDate are required' });
  }
  const healthGoal = await prisma.healthGoal.create({
    data: { userId, title, description, targetDate: new Date(targetDate), achieved: !!achieved }
  });
  res.status(201).json(healthGoal);
});

// Update health goal
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, targetDate, achieved } = req.body;
  const healthGoal = await prisma.healthGoal.update({
    where: { id },
    data: {
      title,
      description,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      achieved
    }
  });
  res.json(healthGoal);
});

// Delete health goal
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.healthGoal.delete({ where: { id } });
  res.status(204).end();
});

export default router; 