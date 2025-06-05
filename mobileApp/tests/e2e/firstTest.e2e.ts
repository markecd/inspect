describe('App Sanity Check', () => {
    beforeAll(async () => {
      await device.launchApp({ delete: true });
    });
  
    it('najde katerikoli znan tekst na zaslonu', async () => {
      
      await expect(element(by.text('Prijava'))).toBeVisible();
    });
  });
  