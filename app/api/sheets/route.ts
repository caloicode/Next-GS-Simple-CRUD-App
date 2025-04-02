import { NextRequest, NextResponse } from 'next/server';
import { addRow, getRows } from '@/lib/googleSheets';

// GET request to fetch all rows
export async function GET() {
  const rows = await getRows();
  return NextResponse.json({ data: rows });
}

// POST request to add a new row
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, lastName, email } = body;

  // Validate data
  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Add row to Google Sheets
  await addRow([firstName, lastName, email]);

  return NextResponse.json({ message: 'Row added successfully' });
}
