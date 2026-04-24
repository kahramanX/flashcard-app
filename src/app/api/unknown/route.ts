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
    
    // Read the existing file
    let fileContents = '[]';
    try {
      fileContents = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      // If file doesn't exist, ignore and use '[]'
      console.warn('unknown_words.json did not exist, initializing empty array.');
    }

    let unknownWords = [];
    try {
      unknownWords = JSON.parse(fileContents);
    } catch (e) {
      console.error('Error parsing unknown_words.json', e);
      // fallback to empty array if corrupted
    }

    // Check if the word is already marked as unknown to avoid duplicates
    const isAlreadyUnknown = unknownWords.some((w: any) => w.id === word.id);
    
    if (!isAlreadyUnknown) {
      unknownWords.push(word);
      fs.writeFileSync(filePath, JSON.stringify(unknownWords, null, 2), 'utf8');
    }

    return NextResponse.json({ success: true, added: !isAlreadyUnknown }, { status: 200 });
  } catch (error) {
    console.error('API /api/unknown failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
