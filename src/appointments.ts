import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all appointments
router.get('/', async (req: Request, res: Response) => {
  const appointments = await prisma.appointment.findMany();
  res.json(appointments);
});

// Get appointment by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) return res.status(404).json({ error: 'Not found' });
  res.json(appointment);
});

// Create appointment
router.post('/', async (req: Request, res: Response) => {
  const { userId, date, doctor, reason } = req.body;
  if (!userId || !date || !doctor || !reason) {
    return res.status(400).json({ error: 'userId, date, doctor, and reason are required' });
  }
  const appointment = await prisma.appointment.create({
    data: { userId, date: new Date(date), doctor, reason }
  });
  res.status(201).json(appointment);
});

// Update appointment
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { date, doctor, reason } = req.body;
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { date: date ? new Date(date) : undefined, doctor, reason }
  });
  res.json(appointment);
});

// Delete appointment
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.appointment.delete({ where: { id } });
  res.status(204).end();
});

export default router; 