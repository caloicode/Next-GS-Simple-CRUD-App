import { google } from 'googleapis';
import credentials from '../google-creds.json';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!; // From .env.local

if (!SPREADSHEET_ID) throw new Error('SPREADSHEET_ID is not defined in .env.local');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

// Function to get all rows
export async function getRows() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A2:C', // Update the range as needed
  });
  return res.data.values || [];
}

// Function to add a new row
export async function addRow(row: [string, string, string]) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A2:C',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
}

// Function to update a row
export async function updateRow(row: [string, string, string], index: number) {
  // Adjust the range dynamically based on the index
  const range = `Sheet1!A${index + 2}:C${index + 2}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
}

// Function to delete a row
export async function deleteRow(index: number) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // This is the Sheet's internal ID, usually 0 for the first sheet
                dimension: 'ROWS',
                startIndex: index + 1, // Skip the header row (0-based)
                endIndex: index + 2,   // Delete one row only
              },
            },
          },
        ],
      },
    });
  }
  