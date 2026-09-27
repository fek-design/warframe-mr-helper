import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { decryptAlecaData, normalizePlayerInventory } from '@/lib/alecaframe/decrypt';

export async function GET() {
  try {
    const localAppData = process.env.LOCALAPPDATA;
    if (!localAppData) {
      return NextResponse.json(
        { success: false, error: 'LOCALAPPDATA environment variable is not defined' },
        { status: 400 }
      );
    }

    const lastDataPath = path.join(localAppData, 'AlecaFrame', 'lastData.dat');
    if (!fs.existsSync(lastDataPath)) {
      return NextResponse.json(
        {
          success: false,
          error: `AlecaFrame data file not found at ${lastDataPath}. Please make sure AlecaFrame is installed and has run at least once.`,
        },
        { status: 404 }
      );
    }

    const stats = fs.statSync(lastDataPath);
    const buffer = fs.readFileSync(lastDataPath);
    const raw = decryptAlecaData(buffer);
    const profile = normalizePlayerInventory(raw, stats.mtime.toISOString());

    return NextResponse.json({
      success: true,
      source: 'local',
      path: lastDataPath,
      lastModified: stats.mtime.toISOString(),
      profile,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during local sync',
      },
      { status: 500 }
    );
  }
}
