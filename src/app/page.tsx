'use client'
import styles from './page.module.css'
import { useState } from 'react';

interface RectData {
  cx: number;
  cy: number;
  w: number;
  h: number;
  selected: boolean;
  seatId: string;
}

interface SectionData {
  sectionId: string | undefined,
  path: string | null;
  rows: RowData[],
}

interface RowData {
  rowId: string;
  row: RectData[];
  rowTarget: string | undefined,
  ticket: {
    availableCount: number;
    cost: number;
    description: string;
    eventId: string;
    fee: number;
    generalAdmission: boolean;
    hide_description: boolean;
    hide_sale_dates: boolean;
    id: string | undefined;
    isActive: boolean;
    locked: null;
    maximum_quantity: number;
    minimum_quantity: number;
    name: string;
    on_sale_status: string;
    pricing: {
      feesWithoutTax: number;
      listing: boolean;
      paymentProcessingFee: number;
      serviceFees: number;
      taxPerTicket: number;
      ticketCost: number;
      ticketCostWithFees: number;
      ticketCostWithFeesAndTax: number;
      ticketFacilityFee: number;
      ticketName: string;
      ticketType: string;
      totalFees: number;
    };
    resale: boolean;
    royalty: number;
    sales_end: string;
    sales_start: string;
    slug: null;
    ticketGroup: string;
    uuid: string;
  };
}

export default function Home() {
  const [result, setResult] = useState<SectionData[]>([]);

  const handleChangeTwo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

      if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const svgString = e.target?.result as string;
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

          const sections = svgDoc.querySelectorAll('g[id^="Sec-"]');
          const parsedResult: SectionData[] = [];

          sections.forEach((section, i) => {
            const sectionNumber = section.getAttribute('id')?.split('-')[1];
            const sectionPath = section.querySelector('path')?.getAttribute('d') || null;
            const rows = section.querySelectorAll(`g[id^="sec-${sectionNumber}-row-"]`);
            const sectionSeats: RowData[] = [];

            rows.forEach((row, ii) => {
              const rowNumber = row.getAttribute('id')?.split('-')[3];
              const seats = row.querySelectorAll(`rect[id^="sec-${sectionNumber}-row-${rowNumber}-seat-"]`);
              let currentRow: RectData[] = [];

              seats.forEach((seat, iii) => {
                const id = seat.getAttribute('id');
                if (id) {
                  const cx = parseFloat(seat.getAttribute('x') || '0');
                  const cy = parseFloat(seat.getAttribute('y') || '0');
                  const w = parseFloat(seat.getAttribute('width') || '0');
                  const h = parseFloat(seat.getAttribute('height') || '0');
                  currentRow.push({ cx, cy, w, h, selected: false, seatId: id });
                }
              })
              let rowTargetSeat = undefined;
              if (currentRow.length !== 0) {
                let middleIndex = Math.floor(currentRow.length / 2); // Middle is of the row, used to target tooltip
                rowTargetSeat = currentRow[middleIndex].seatId;
              }

              let rowId = `${rowNumber}`;
              let ticket = {
                availableCount: 12,
                cost: 60,
                description: 'VJX IS SEXY',
                eventId: '6c109ea3-23c2-4fa9-82ce-79346043a9a0',
                fee: 2,
                generalAdmission: true,
                hide_description: false,
                hide_sale_dates: false,
                id: rowNumber,
                isActive: true,
                locked: null,
                maximum_quantity: 3,
                minimum_quantity: 1,
                name: '',
                on_sale_status: 'available',
                pricing: {
                  feesWithoutTax: 5.3,
                  listing: false,
                  paymentProcessingFee: 3.3,
                  serviceFees: 0,
                  taxPerTicket: 5.52,
                  ticketCost: 60,
                  ticketCostWithFees: 62,
                  ticketCostWithFeesAndTax: 70.82,
                  ticketFacilityFee: 2,
                  ticketName: `Section ${sectionNumber} Row ${rowId}`,
                  ticketType: 'Standard Ticket',
                  totalFees: 10.82,
                },
                resale: false,
                royalty: 5,
                sales_end: '2023-04-09T02:00:00.000Z',
                sales_start: '2023-01-12T15:30:00.000Z',
                slug: null,
                ticketGroup: 'b9261819-a184-4a95-a22d-337df5154',
                uuid: 'b9261819-a184-4a95-a22d-337df5154'
              };

              sectionSeats.push({ rowId, row: currentRow, rowTarget: rowTargetSeat, ticket });
              currentRow = [];
            })
            parsedResult.push({ sectionId: sectionNumber, path: sectionPath, rows: sectionSeats });
          });
        setResult(parsedResult);
      }
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result));
  }

  const saveJSON = async () => {
    const formData = new FormData();
    formData.append('json', JSON.stringify(result));
    await fetch("/api/save", {
      method: 'POST',
      body: formData,
    });
  }

  return (
    <main className={styles.main}>
      <div className={styles.mainTwo}>
        <p>Upload an SVG file</p>
        <input
          type="file"
          name="svgFile"
          id="svgFile"
          accept=".svg"
          onChange={handleChangeTwo}
        />
        <button onClick={copyJson}>Copy</button>
        {/* <button onClick={saveJSON}>Save</button> */}
        <pre style={{maxWidth: 800, overflow: 'hidden'}}>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </main>
  )
}
