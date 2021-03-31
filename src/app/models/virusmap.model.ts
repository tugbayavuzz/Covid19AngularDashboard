export interface TheVirusTracker {
    dateRange: string;
    cities: City[];
  }

  interface City {
    name: string;
    caseRatio: string;
  }

