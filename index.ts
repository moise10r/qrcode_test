/**
 * Puzzle: QR Code
 * Solve the incomplete QR code below and follow the obtained link.
 * Each row or column is labeled with a number.
 * The number is the clue that indicates the count of black squares of the solution within that row or column respectively.
 *
 * Notes:
 * - Some boilerplate code is provided to generate a BMP image from a grid of 1s and 0s and get you started quickly.
 * - The solution should return all possible valid solutions.
 * - The solution should consider algorithmic complexity, performance, and memory usage.
 */

import * as fs from "fs";

// 1 for black
// 0 for white or unknown
const GRID = [
  1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
  0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0,
  1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0,
  0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
  1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0,
  1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1,
  1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0,
  1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1,
  0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1,
];

const COLUMNS = [
  16, 7, 15, 12, 14, 6, 17, 2, 9, 10, 12, 12, 11, 5, 11, 9, 15, 10, 10, 14, 13,
];

const ROWS = [
  16, 7, 12, 11, 13, 6, 17, 2, 8, 15, 15, 10, 10, 9, 16, 8, 12, 11, 13, 6, 13,
];

function createBMPFromGrid(grid: number[], filename: string, cellSize = 16) {
  const size = Math.sqrt(grid.length);
  if (!Number.isInteger(size)) {
    throw new Error("Grid is not a square.");
  }

  // We'll add one cell of white border around the image
  const finalSize = size + 2; // one cell border on each side
  const width = finalSize * cellSize;
  const height = finalSize * cellSize;

  const bytesPerPixel = 3; // 24-bit bitmap (BGR)
  const rowStride = width * bytesPerPixel;
  const padding = (4 - (rowStride % 4)) % 4;

  const imageSize = (rowStride + padding) * height;
  const fileSize = 54 + imageSize; // 54 = header (14) + DIB header (40)

  // BMP Header
  const bmpHeader = Buffer.alloc(14);
  bmpHeader.write("BM"); // Signature
  bmpHeader.writeUInt32LE(fileSize, 2); // File size
  bmpHeader.writeUInt32LE(0, 6); // Reserved
  bmpHeader.writeUInt32LE(54, 10); // Pixel data offset

  // DIB Header (BITMAPINFOHEADER)
  const dibHeader = Buffer.alloc(40);
  dibHeader.writeUInt32LE(40, 0); // DIB header size
  dibHeader.writeInt32LE(width, 4); // Width
  dibHeader.writeInt32LE(height, 8); // Height
  dibHeader.writeUInt16LE(1, 12); // Planes
  dibHeader.writeUInt16LE(24, 14); // Bits per pixel
  dibHeader.writeUInt32LE(0, 16); // Compression = none
  dibHeader.writeUInt32LE(imageSize, 20); // Image size
  dibHeader.writeInt32LE(2835, 24); // X pixels per meter
  dibHeader.writeInt32LE(2835, 28); // Y pixels per meter
  dibHeader.writeUInt32LE(0, 32); // Colors in palette
  dibHeader.writeUInt32LE(0, 36); // Important colors

  const pixelData = Buffer.alloc(imageSize);

  for (let r = 0; r < finalSize; r++) {
    for (let c = 0; c < finalSize; c++) {
      let cellValue: number;
      if (r === 0 || r === finalSize - 1 || c === 0 || c === finalSize - 1) {
        // Border cell
        cellValue = 0;
      } else {
        // Inner cell maps to original grid
        const originalCell = grid[(r - 1) * size + (c - 1)];
        cellValue = originalCell;
      }

      const color = cellValue === 1 ? 0 : 255; // black=0, white=255

      // Fill the corresponding cellSize x cellSize block
      for (let y = 0; y < cellSize; y++) {
        for (let x = 0; x < cellSize; x++) {
          const bmpY = height - 1 - (r * cellSize + y);
          const bmpX = c * cellSize + x;
          const index = bmpY * (rowStride + padding) + bmpX * bytesPerPixel;

          // BMP uses BGR order
          pixelData[index] = color; // Blue
          pixelData[index + 1] = color; // Green
          pixelData[index + 2] = color; // Red
        }
      }
    }
  }

  const bmpBuffer = Buffer.concat([bmpHeader, dibHeader, pixelData]);
  fs.writeFileSync(filename, bmpBuffer);
}

function solve(grid: number[], columns: number[], rows: number[]): number[][] {
  // TODO: Implement the solution, returning an array of valid solutions
  return [];
}

const solutions = solve(GRID, COLUMNS, ROWS);
console.log(`Found ${solutions.length} solutions.`);

if (!solutions.length) {
  console.log("No solution found");
  process.exit(1);
}

for (let i = 0; i < solutions.length; i++) {
  createBMPFromGrid(solutions[i], `QR_Code_Solution_${i}.bmp`); // Scan this QR code to get the URL
}
