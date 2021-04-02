export interface TheVirusTracker {
  dateRange: string;
  cities: City[];
}

export interface City {
  name: string;
  caseRatio: number;
}
