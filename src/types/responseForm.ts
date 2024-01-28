export interface CombinedInfo {
  type: 'combinedInfo';
  cptCode: string;
  hospitalPrice: number | null;
  normalPrice: number;
  description: string;
  /// Make this true if there's a big difference between hospitalPrice
  /// and normalPrice
  highlight: boolean;
}

export interface FailedRow {
  type: 'failedRow';
  description: string;
  cptCode: string;
}

export type ResponseItem = CombinedInfo | FailedRow;
