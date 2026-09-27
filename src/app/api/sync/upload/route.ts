import { NextRequest, NextResponse } from 'next/server';
import { decryptAlecaData, normalizePlayerInventory } from '@/lib/alecaframe/decrypt';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: 'No file provided. Please upload a valid lastData.dat file.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'The uploaded file is empty.' },
        { status: 400 }
      );
    }

    const raw = decryptAlecaData(buffer);
    const profile = normalizePlayerInventory(raw, new Date().toISOString());

    return NextResponse.json({
      success: true,
      source: 'upload',
      filename: file instanceof File ? file.name : 'lastData.dat',
      profile,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process uploaded file',
      },
      { status: 400 }
    );
  }
}
