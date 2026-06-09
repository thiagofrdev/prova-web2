//nomear para database.ts
import { PrismaClient } from '@prisma/client';

// Instancia e exporta o cliente para usar nas rotas
export const prisma = new PrismaClient();