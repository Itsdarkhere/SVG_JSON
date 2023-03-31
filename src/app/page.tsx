'use client'
import styles from './page.module.css'
import { useState } from 'react';

interface RectData {
  cx: number;
  cy: number;
  w: number;
  h: number;
  transform: string;
  selected: boolean;
  id: number;
}

export default function Home() {
  const [result, setResult] = useState<RectData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const svgString = e.target?.result as string;
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

        const rects = svgDoc.querySelectorAll('rect');
        const parsedResult: RectData[] = [];

        rects.forEach((rect) => {
          const id = rect.getAttribute('id');
          if (id && id.startsWith('Seat')) {
            const cx = parseFloat(rect.getAttribute('x') || '0');
            const cy = parseFloat(rect.getAttribute('y') || '0');
            const w = parseFloat(rect.getAttribute('width') || '0');
            const h = parseFloat(rect.getAttribute('height') || '0');
            const transform = rect.getAttribute('transform') || '';
            parsedResult.push({ cx, cy, w, h, transform, selected: false, id: 0 });
          }
        });

        setResult(parsedResult);
      };
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.mainTwo}>
        <p>Upload an SVG file</p>
        <input
          type="file"
          name="svgFile"
          id="svgFile"
          accept=".svg"
          onChange={handleFileChange}
        />
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </main>
  )
}
