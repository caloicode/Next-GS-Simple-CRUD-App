import { NextRequest, NextResponse } from 'next/server';
import { deleteRow } from '@/lib/googleSheets';

export async function DELETE(req: NextRequest) {
  const { index } = await req.json();

  // Ensure index is provided
  if (index === undefined) {
    return NextResponse.json({ error: 'Missing index' }, { status: 400 });
  }

  // Delete the row in Google Sheets
  await deleteRow(index);

  return NextResponse.json({ message: 'Row deleted successfully' });
}
