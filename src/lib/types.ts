import type { z } from 'zod';
import type { GenerateWitnessStatementsOutput as Gwso } from '@/ai/flows/generate-witness-statements';

export type GenerateWitnessStatementsOutput = Gwso;
export type WitnessStatement = Gwso['statements'][0];
