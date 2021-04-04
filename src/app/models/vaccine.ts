export interface VaccineTracker {
  date: string;
  location: string;
  source_url: string;
  vaccine: string;
  total_vaccinations ?: number;
  pneumoniaPercent ?: number;
  people_vaccinated ?: number;
  people_fully_vaccinated ?: number;
}
