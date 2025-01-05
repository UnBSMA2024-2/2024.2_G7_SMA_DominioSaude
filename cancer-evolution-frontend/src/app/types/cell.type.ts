export interface Cell {
  name: string;
  geneticPredisposition: string;
  cellType: CellType;
}

export enum CellType {
  NormalCell = 'NormalCell',
  DamagedCell = 'DamagedCell',
  PreCancerousCell = 'PreCancerousCell',
  CancerousCell = 'CancerousCell',
}
