import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all medications
router.get('/', async (req: Request, res: Response) => {
  const medications = await prisma.medication.findMany();
  res.json(medications);
});

// Get medication by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const medication = await prisma.medication.findUnique({ where: { id } });
  if (!medication) return res.status(404).json({ error: 'Not found' });
  res.json(medication);
});

// Create medication
router.post('/', async (req: Request, res: Response) => {
  const { name, dosage, userId } = req.body;
  if (!name || !dosage || !userId) {
    return res.status(400).json({ error: 'name, dosage, and userId are required' });
  }
  const medication = await prisma.medication.create({
    data: { name, dosage, userId }
  });
  res.status(201).json(medication);
});

// Update medication
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, dosage } = req.body;
  const medication = await prisma.medication.update({
    where: { id },
    data: { name, dosage }
  });
  res.json(medication);
});

// Delete medication
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.medication.delete({ where: { id } });
  res.status(204).end();
});

export default router; 