import { COLUMNS, GRID, ROWS, solve } from "./qrcode";

describe("solve function", () => {
  it("should return all 1 solution", () => {
    const solutions = solve(GRID, COLUMNS, ROWS);
    console.log("Found", solutions.length, "solutions.");
    expect(solutions.length).toEqual(1);
  });
});
