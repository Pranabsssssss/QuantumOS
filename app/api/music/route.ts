import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const musicDir = path.join(process.cwd(), 'public', 'Music');
    
    if (!fs.existsSync(musicDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(musicDir);
    const audioFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp3', '.wav', '.ogg'].includes(ext);
    });

    const tracks = audioFiles.map(file => {
      // Basic cleanup for title/artist if possible, otherwise use filename
      const nameWithoutExt = path.parse(file).name;
      const parts = nameWithoutExt.split(' - ');
      
      return {
        title: parts.length > 1 ? parts[1] : parts[0],
        artist: parts.length > 1 ? parts[0] : 'Unknown Artist',
        src: `/Music/${file}`
      };
    });

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error reading music directory:', error);
    return NextResponse.json({ error: 'Failed to read music directory' }, { status: 500 });
  }
}
