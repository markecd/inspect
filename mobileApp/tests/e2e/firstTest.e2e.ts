describe('Prvi zagon aplikacije', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
  });

  it('prikaže naslovno stran', async () => {
    await expect(element(by.text('Prijava'))).toBeVisible();
  });
});
