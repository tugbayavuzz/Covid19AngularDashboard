import { PdFreeAngularcliPage } from './app.po';

describe('pd-free-angularcli App', () => {
  let page: PdFreeAngularcliPage;

  beforeEach(() => {
    page = new PdFreeAngularcliPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect<any>(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
