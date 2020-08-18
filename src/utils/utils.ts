export const generateClassNameForCell = (row: number, col: number): string => {
  let className = `cell_${row}_${col}`;
  return className;
};
