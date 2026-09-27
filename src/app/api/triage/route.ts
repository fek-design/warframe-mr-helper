import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { decryptAlecaData, normalizePlayerInventory } from '@/lib/alecaframe/decrypt';
import { triagePlayerInventory } from '@/lib/warframe/triage';
import { CATALOG } from '@/lib/warframe/catalog';
import type { NormalizedPlayerProfile } from '@/lib/alecaframe/types';

export async function GET() {
  try {
    const localAppData = process.env.LOCALAPPDATA;
    if (!localAppData) {
      return NextResponse.json(
        { success: false, error: 'LOCALAPPDATA not defined' },
        { status: 400 }
      );
    }

    const lastDataPath = path.join(localAppData, 'AlecaFrame', 'lastData.dat');
    if (!fs.existsSync(lastDataPath)) {
      return NextResponse.json(
        { success: false, error: 'AlecaFrame lastData.dat not found locally' },
        { status: 404 }
      );
    }

    const stats = fs.statSync(lastDataPath);
    const buffer = fs.readFileSync(lastDataPath);
    const raw = decryptAlecaData(buffer);
    const profile = normalizePlayerInventory(raw, stats.mtime.toISOString());
    const triage = triagePlayerInventory(profile, CATALOG);

    return NextResponse.json({
      success: true,
      source: 'local',
      profile,
      triage,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Triage error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile = body.profile as NormalizedPlayerProfile;

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'No player profile provided' },
        { status: 400 }
      );
    }

    const triage = triagePlayerInventory(profile, CATALOG);

    return NextResponse.json({
      success: true,
      triage,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Triage error' },
      { status: 400 }
    );
  }
}
