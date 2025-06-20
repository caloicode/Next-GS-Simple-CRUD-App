# 📗 Google Sheets CRUD with Next.js

This guide walks you through setting up a **Google Sheets CRUD app** using **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS** — ready for both local dev and Vercel deployment.

---

## 📝 Google Sheet Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Create a new project**
3. In the sidebar, go to **APIs & Services > Library**
   - Search and enable **Google Sheets API**
4. Go to **APIs & Services > Credentials**
   - Click **Create Credentials > Service Account**
   - Fill out the name and click **Done**
5. Click on the service account > **Keys** tab
   - Add a new key > Choose JSON > Download it
6. Open your target **Google Sheet**
   - Click **Share** > add the **service account email** (e.g. `example@project.iam.gserviceaccount.com`) as **Editor**

---

## ⚙️ Project Setup

```bash
npx create-next-app@latest google-sheets-crud
cd google-sheets-crud
npm install googleapis
```

---

## 📁 Project Structure

```txt
app/
  └── api/
       └── sheets/
            └── route.ts       # API route for GET, POST, PUT, DELETE
  └── page.tsx                 # Main UI
components/
  └── FormModal.tsx
  └── Table.tsx
  └── DeleteConfirm.tsx
lib/
  └── googleSheets.ts         # Google Sheets utility functions
.env.local                     # Your environment variables
google-creds.json              # (TEMPORARY - see encoding step)
```

---

## 🔌 Environment Setup

`.env.local`
```env
SPREADSHEET_ID=your_google_sheet_id
GOOGLE_CREDS_JSON_BASE64=your_encoded_base64_creds
```

**Important:**
- Add `google-creds.json` to `.gitignore`
- To generate the base64 credentials:
  - Run this command in your terminal:
    ```bash
    cat google-creds.json | base64 -w 0
    ```
  - Copy the full output (triple-click to not miss any characters 📌)
  - Paste that as the value for `GOOGLE_CREDS_JSON_BASE64` in your `.env.local` file
  - In Vercel, add it as an environment variable as well

---

## 🔧 Google Sheets Utility (lib/googleSheets.ts)

```ts
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const GOOGLE_CREDS_BASE64 = process.env.GOOGLE_CREDS_JSON_BASE64!;

if (!SPREADSHEET_ID || !GOOGLE_CREDS_BASE64) {
  throw new Error('Missing env vars');
}

const credentials = JSON.parse(
  Buffer.from(GOOGLE_CREDS_BASE64, 'base64').toString()
);

const auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
const sheets = google.sheets({ version: 'v4', auth });

// Define: getRows, addRow, updateRow, deleteRow using `sheets.spreadsheets.values`
```

---

## 📡 API Routes (app/api/sheets/route.ts)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getRows, addRow } from '@/lib/googleSheets';

export async function GET() {
  const rows = await getRows();
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const { firstName, lastName, email } = await req.json();
  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  await addRow([firstName, lastName, email]);
  return NextResponse.json({ message: 'Added successfully' });
}
```

---

## 🧠 Core Logic Overview

### 1. **lib/googleSheets.ts**
Handles Google Sheets API interaction securely using base64 credentials and `googleapis`.

### 2. **API Routes**
`/api/sheets` handles reading and writing rows — logic separated for clean architecture.

### 3. **UI Components**
The UI components interact through props and state to handle user input, form submissions, and dynamic updates. The main page maintains the core app state, handles interactions like opening modals and triggering API actions, and passes data and callbacks to reusable components for displaying, editing, or deleting data.

---

## 🚀 Deployment (Vercel)

1. Push project to GitHub
2. Go to [vercel.com](https://vercel.com/) > New Project > Import your repo
3. Add environment variables:
   - `SPREADSHEET_ID`
   - `GOOGLE_CREDS_JSON_BASE64` (base64 of your service account JSON)
4. Deploy!

---

## 📄 `next.config.ts`

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
```

---

## 🎨 Styling Extras

### ✅ Tailwind Dark Mode Setup (globals.css)
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

### ✅ Add Heroicons
```bash
npm install @heroicons/react
```
## 📌 Additional Notes

- 🖼️ **Image Optimization (TinyJPG)**  
  Use [https://tinyjpg.com/](https://tinyjpg.com/) to compress large images before uploading, especially for Open Graph or embedded previews.

- ⚠️ **Next.js Sync Dynamic Params Error**  
  If you encounter errors related to dynamic route params, refer to this:  
  https://nextjs.org/docs/messages/sync-dynamic-apis

- ✍️ **Tailwind Typography Plugin**  
  Add the plugin directly in your `globals.css` file:  
  ```css
  @plugin "@tailwindcss/typography";
  ```

  This plugin is used in this project to style content coming from `dangerouslySetInnerHTML` (HTML string rendering from Google Sheets).  
  It ensures proper typography for paragraphs, lists, links, and headings in the notes section, giving a clean and readable format.

- 🔖 **Favicon Format**  
  Ideal size: `64x64px`  
  Convert `.jpg` to `.ico` using: [https://convertio.co/](https://convertio.co/)

