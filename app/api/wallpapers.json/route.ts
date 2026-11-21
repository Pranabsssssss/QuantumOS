import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const wpDir = path.join(process.cwd(), 'public', 'wallpapers');
    
    if (!fs.existsSync(wpDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(wpDir);
    const wallpaperFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.webm'].includes(ext);
    });

    const wallpapers = wallpaperFiles.map(file => {
      const ext = path.extname(file).toLowerCase();
      const isVideo = ['.mp4', '.webm'].includes(ext);
      // Clean up name for display
      const name = path.parse(file).name.replace(/[-_]/g, ' ');
      
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        path: `/wallpapers/${file}`,
        isVideo
      };
    });

    return NextResponse.json(wallpapers);
  } catch (error) {
    console.error('Error reading wallpapers directory:', error);
    return NextResponse.json({ error: 'Failed to read wallpapers directory' }, { status: 500 });
  }
}
