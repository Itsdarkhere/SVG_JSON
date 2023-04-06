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
  id: string;
}

interface SectionData {
  id: string,
  path: string | null;
  seats: RectData[],
}

export default function Home() {
  const [result, setResult] = useState<SectionData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const svgString = e.target?.result as string;
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

        const sections = svgDoc.querySelectorAll('g[id^="Section-"]');
        const parsedResult: SectionData[] = [];

        sections.forEach((section) => {
          const sectionId = section.getAttribute('id');
          const sectionPath = section.querySelector('path')?.getAttribute('d') || null;
          const sectionSeats: RectData[] = [];

          if (sectionId) {
            const seatRects = section.querySelectorAll('rect[id^="seat-"]');

            seatRects.forEach((rect) => {
              const id = rect.getAttribute('id');
              if (id) {
                const cx = parseFloat(rect.getAttribute('x') || '0');
                const cy = parseFloat(rect.getAttribute('y') || '0');
                const w = parseFloat(rect.getAttribute('width') || '0');
                const h = parseFloat(rect.getAttribute('height') || '0');
                const transform = rect.getAttribute('transform') || '';
                sectionSeats.push({ cx, cy, w, h, transform, selected: false, id: id });
              }
            });

            parsedResult.push({ id: sectionId, path: sectionPath, seats: sectionSeats });
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
        <pre style={{maxWidth: 800, overflow: 'hidden'}}>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </main>
  )
}
