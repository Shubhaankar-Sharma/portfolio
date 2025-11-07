import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs';
import { join } from 'path';
import profileData from '../public/content/profileData.json';

export const alt = profileData.general.byline;
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  const imagePath = join(process.cwd(), 'public/content/media/profilePhoto.jpg');
  const imageBuffer = readFileSync(imagePath);
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={base64Image} height="400" style={{ borderRadius: '50%' }} />
      </div>
    ),
    {
      ...size,
    }
  )
}
