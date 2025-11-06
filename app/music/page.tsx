import { promises as fs } from 'fs';
import path from 'path';
import MusicClient from './MusicClient';

export type MusicItem = {
  title: string;
  artist: string;
  year?: string;
  note?: string;
  albumArt?: string;
  links?: {
    spotify?: string;
    appleMusic?: string;
    tidal?: string;
    youtube?: string;
  };
};

export type MusicData = {
  recommendations?: MusicItem[];
};

async function getMusicData(): Promise<MusicData> {
  try {
    const musicPath = path.join(process.cwd(), 'content/music.json');
    const musicContent = await fs.readFile(musicPath, 'utf8');
    return JSON.parse(musicContent);
  } catch (error) {
    return { recommendations: [] };
  }
}

export default async function MusicPage() {
  const musicData = await getMusicData();
  return <MusicClient musicData={musicData} />;
}
