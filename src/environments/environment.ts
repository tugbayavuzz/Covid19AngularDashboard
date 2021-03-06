// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiJsonUrl:
    'https://raw.githubusercontent.com/ozanerturk/covid19-turkey-api/master/dataset/timeline.json',
  apiCsvUrl:
    'https://raw.githubusercontent.com/ozanerturk/covid19-turkey-api/master/dataset/timeline.csv',
  apiVaccineUrl: 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/Turkey.csv',


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
