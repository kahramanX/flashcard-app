import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'progress.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ currentIndex: 0 });
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ currentIndex: 0 });
  }
}

export async function POST(req: Request) {
  try {
    const { currentIndex } = await req.json();
    const filePath = path.join(process.cwd(), 'progress.json');
    fs.writeFileSync(filePath, JSON.stringify({ currentIndex }, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
