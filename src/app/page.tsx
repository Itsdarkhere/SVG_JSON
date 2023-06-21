'use client'
import styles from './page.module.css'
import { useState } from 'react';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

interface Data {
  sections: { [key: string]: SectionData },
  rows: { [key: string]: RowData },
  seats: { [key: string]: SeatData },
}

interface SectionData {
  sectionId: string | undefined,
  path: string | null;
  zoomable: boolean;
  fill: string | null,
  stroke: string | null,
  strokeWidth: string | null,
  identifier: {
    path: string | null;
    fill: string | null;
    opacity: string | null;
  },
  ticket: Ticket | null;
  rows: string[];
}

interface RowData {
  rowId: string;
  sectionId: string,
  seats: string[];
  ticket: Ticket;
}

interface SeatData {
  cx: number;
  cy: number;
  w: number;
  h: number;
  selected: boolean;
  seatId: string;
  sectionId: string;
  rowId: string;
}

interface Ticket {
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
}

export default function Home() {
  const [result, setResult] = useState<Data>({
    sections: {},
    rows: {},
    seats: {},
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

      if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const svgString = e.target?.result as string;
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
          const sections = svgDoc.querySelectorAll('g[id^="Sec-"]');

          // Store stuff in these
          const sectionData: { [key: string]: SectionData } = {};
          const rowData: { [key: string]: RowData } = {};
          const seatData: { [key: string]: SeatData } = {};
          // RowNumber is unreliable, so create our own
          let uniqueRowNumber = 0;

          sections.forEach((section, i) => {
            const sectionNumber = section.getAttribute('id')?.split('-')[1];
            const zoomable = section.getAttribute('class');
            const fill = section.getAttribute('fill');
            const stroke = section.getAttribute('stroke');
            const strokeWidth = section.getAttribute('stroke-width');

            // Check if section is zoomable, if yes then we need seats etc, otherwise we dont
            // In that case we add ticket directly to section
            let isZoomable = false;
            if (zoomable === 'YZ') {
              isZoomable = true;
            }

            const sectionPath = section.querySelector('path')?.getAttribute('d') || null;
            const rows = section.querySelectorAll(`g[id^="sec-${sectionNumber}-row-"]`);

            // Identifier is like the text above a section
            const identifier = section.querySelector(`g[id^="identifier"]`);
            const identifierText = identifier?.querySelector('path');
            const identifierTextPath = identifierText?.getAttribute('d') || null;
            const identifierTextFill = identifierText?.getAttribute('fill') || null;
            const identifierTextOpacity = identifierText?.getAttribute('fill-opacity') || null;

            const sectionRows: string[] = [];

            if (isZoomable) {
              rows.forEach((row, ii) => {
                uniqueRowNumber++;
                const rowNumber = row.getAttribute('id')?.split('-')[3];
                const seats = row.querySelectorAll(`rect[id^="sec-${sectionNumber}-row-${rowNumber}-seat-"]`);
                let rowSeats: string[] = [];
                if (uniqueRowNumber) sectionRows.push(uniqueRowNumber.toString());

  
                seats.forEach((seat, iii) => {
                  const id = seat.getAttribute('id');
                  if (id) {
                    const cx = parseFloat(seat.getAttribute('x') || '0');
                    const cy = parseFloat(seat.getAttribute('y') || '0');
                    const w = parseFloat(seat.getAttribute('width') || '0');
                    const h = parseFloat(seat.getAttribute('height') || '0');
                    seatData[id] = { cx, cy, w, h, selected: false, seatId: id, sectionId: sectionNumber!, rowId: uniqueRowNumber.toString()! };
                    rowSeats.push(id);
                  }
                })
  
                let rowId = `${uniqueRowNumber}`;
                let ticket = {
                  availableCount: 12,
                  cost: 60,
                  description: 'VJX IS SEXY',
                  eventId: '6c109ea3-23c2-4fa9-82ce-79346043a9a0',
                  fee: 2,
                  generalAdmission: true,
                  hide_description: false,
                  hide_sale_dates: false,
                  id: uniqueRowNumber.toString(),
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
  
                rowData[rowId] = { rowId, sectionId: sectionNumber!, seats: rowSeats, ticket };
                rowSeats = [];
              })
            }

            let sectionTicket = null;
            if (!isZoomable) {
              sectionTicket = {
                availableCount: 12,
                cost: 60,
                description: 'VJX IS SEXY',
                eventId: '6c109ea3-23c2-4fa9-82ce-79346043a9a0',
                fee: 2,
                generalAdmission: true,
                hide_description: false,
                hide_sale_dates: false,
                id: sectionNumber,
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
                  ticketName: `Section ${sectionNumber}`,
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
              }
            }
            sectionData[sectionNumber!] = { 
              sectionId: sectionNumber, 
              path: sectionPath, 
              rows: sectionRows, 
              zoomable: isZoomable, 
              ticket: sectionTicket, 
              fill, stroke, strokeWidth,
              identifier: {
                path: identifierTextPath,
                fill: identifierTextFill,
                opacity: identifierTextOpacity,
              }  
            }
          });
        setResult({
          sections: sectionData,
          rows: rowData,
          seats: seatData,
        });
      }
    }
  };

  const getFoundSections = () => {
    return (
      Object.values(result.sections).map((sectionData, i) => {
        const totalSeats = sectionData.rows.reduce((acc, rowId) => {
          const row = result.rows[rowId];
          return acc + row.seats.length;
        }, 0);
        return (
          <div key={i} className={styles.secinfo}>
            <p>SectionId: {sectionData.sectionId}</p>
            <p>Section fill color: {sectionData.fill}</p>
            <p>Section rows length: {sectionData.rows.length}</p>
            <p>Is section zoomable: {JSON.stringify(sectionData.zoomable)}</p>
            <p>Total seats in section: {totalSeats}</p>
          </div>
        )
      })
    )
  }

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "seatmap.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return (
    <main className={`${styles.main} ${inter.className}`}>
      <div className={styles.mainTwo}>
        <p>Choose an SVG</p>
        <input
          type="file"
          name="svgFile"
          id="svgFile"
          accept=".svg"
          onChange={handleChange}
        />
        {Object.keys(result.sections).length > 0 && <button className={styles.copybutton} onClick={downloadJSON}>Download result</button>}
        <div className={styles.jsoninfo}>
          JSON condensed information
          <p className={styles.jsonexplainer}>Should have correct amount of sections, rows, seats, the right colors etc </p>
        </div>
        {getFoundSections()}
        <div className={styles.jsoninfo}>
          JSON entire result
          <p className={styles.jsonexplainer}>If theres something weird in the &quot;condensed information&quot; you can have a closer look here</p>
        </div>
        <pre className={styles.jsonres}>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </main>
  )
}
