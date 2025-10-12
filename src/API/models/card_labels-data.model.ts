//For Labels Created For Board
export interface LabelDataModel {
  color: string;
  name: string;
  idBoard: string;
}

// For Labels Created On Card Directly
export interface CardLabelDataModel {
  color: string;
  name?: string;
}

// For Adding Label To Card Only
export interface LabelOperationsDataModel {
  value: string;
}

// export interface LabelDataModelSimplified {
//   color?: string;
//   name?: string;
//   idBoard?: string;
// }
