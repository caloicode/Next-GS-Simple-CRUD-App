import { NextRequest, NextResponse } from 'next/server';
import { updateRow } from '@/lib/googleSheets';

export async function PUT(req: NextRequest) {
  const { row, index } = await req.json();

  // Check if required fields are present
  if (!row || !row[0] || !row[1] || !row[2] || index === undefined) {
    return NextResponse.json({ error: 'Missing data or index' }, { status: 400 });
  }

  // Update row in Google Sheets
  await updateRow(row, index);

  return NextResponse.json({ message: 'Row updated successfully' });
}
