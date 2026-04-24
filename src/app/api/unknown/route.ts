import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const word = await req.json();

    if (!word || !word.id || !word.word) {
      return NextResponse.json(
        { error: 'Invalid word object' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'unknown_words.json');
    
    let fileContents = '[]';
    try {
      fileContents = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      console.warn('unknown_words.json did not exist, initializing empty array.');
    }

    let unknownWords = [];
    try {
      unknownWords = JSON.parse(fileContents);
    } catch (e) {
      console.error('Error parsing unknown_words.json', e);
    }

    const isAlreadyUnknown = unknownWords.some((w: any) => w.id === word.id);
    
    if (isAlreadyUnknown) {
      // Remove it
      unknownWords = unknownWords.filter((w: any) => w.id !== word.id);
      fs.writeFileSync(filePath, JSON.stringify(unknownWords, null, 2), 'utf8');
      return NextResponse.json({ success: true, status: 'removed' }, { status: 200 });
    } else {
      // Add it
      unknownWords.push(word);
      fs.writeFileSync(filePath, JSON.stringify(unknownWords, null, 2), 'utf8');
      return NextResponse.json({ success: true, status: 'added' }, { status: 200 });
    }

  } catch (error) {
    console.error('API /api/unknown failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
