export interface VaccineTracker {
  result: Cities[];

}
export interface Cities {
  name: string;
  total: number;
  firstDose: number;
  secondDose: number;


}
