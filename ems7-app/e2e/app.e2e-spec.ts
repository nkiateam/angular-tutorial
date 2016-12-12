import { Ems7AppPage } from './app.po';

describe('ems7-app App', function() {
  let page: Ems7AppPage;

  beforeEach(() => {
    page = new Ems7AppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
