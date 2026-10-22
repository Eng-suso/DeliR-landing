import { expect, test } from '@playwright/test';

test('pilot validates before sending and confirms only accepted submissions', async ({ page }) => {
  const requests: string[] = [];
  let attempts = 0;
  await page.route('**/api/pilot.php', async route => {
    attempts++;
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject({ email: 'demo@example.test', source: 'delir-pilot-application' });
    await route.fulfill({ status: attempts === 1 ? 503 : 201, contentType: 'application/json', body: attempts === 1 ? '{"error":"unavailable"}' : '{"accepted":true}' });
  });
  page.on('request', request => { if (request.method() === 'POST') requests.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('.landing-page')).toHaveAttribute('data-client-ready', 'true');
  const pilotLink = page.locator('#pilot').getByRole('link', { name: 'Testa DeliR sul tuo progetto' });
  await pilotLink.scrollIntoViewIfNeeded();
  await expect.poll(() => pilotLink.evaluate(link => {
    const box = link.getBoundingClientRect();
    return document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)?.closest('a') === link;
  })).toBe(true);
  await pilotLink.click();
  await expect(page).toHaveURL(/\/pilot#application$/);
  await expect(page.locator('#application')).toBeInViewport();
  await expect(page.locator('#application')).toBeFocused();
  if (await page.getByRole('link', { name: 'Scrivimi per valutare un pilot' }).isVisible()) {
    await expect(page.getByRole('form')).toHaveCount(0);
    expect(requests).toEqual([]);
    return;
  }
  const submit = page.locator('form button[type="submit"]');
  await submit.click();
  await expect(page.getByLabel('Nome e cognome')).toBeFocused();
  await expect(page.getByText('Inserisci il tuo nome.', { exact: true })).toBeVisible();
  await page.getByLabel('Nome e cognome').fill('Demo User');
  await page.getByLabel('Email di lavoro').fill('demo@example.test');
  await page.getByLabel('Tipo di attività').selectOption('independent');
  await page.getByLabel('Tempistica dell’incarico').selectOption('active');
  await page.getByLabel('Processo o problema da analizzare').fill('Review a fictional procurement approval process.');
  await submit.click();
  await expect(page.getByText('Non siamo riusciti a inviare la candidatura. Riprova.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Nome e cognome')).toHaveValue('Demo User');
  await expect(page.getByText('Candidatura ricevuta.', { exact: true })).toHaveCount(0);
  await submit.click();
  await expect(page.getByRole('heading', { name: 'Candidatura ricevuta.' })).toBeVisible();
  expect(attempts).toBe(2);
  expect(requests).toHaveLength(2);
});

test('public pages have no developer preview copy in either language', async ({ page }) => {
  for (const path of ['/v2', '/pilot', '/waitlist', '/privacy']) {
    for (const language of ['it', 'en']) {
      await page.goto(`${path}?lang=${language}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/anteprima del modulo|form preview|verifica i dati|check your details|anteprima DeliR|DeliR preview|nessun dato viene inviato o salvato/i);
      await expect(page.locator('.v2-preview-bar')).toHaveCount(0);
    }
  }
});

test('waitlist does not collect data before privacy and delivery are ready', async ({ page }) => {
  await page.goto('/waitlist');
  if (process.env.PLAYWRIGHT_WAITLIST_ENABLED === 'true') {
    await expect(page.getByRole('form')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Iscriviti e ricevi la demo' })).toBeEnabled();
    return;
  }
  await expect(page.getByRole('form')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Scrivimi per entrare nella lista d’attesa' })).toBeVisible();
});

test('language choice is shareable and persists after reload', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Apri il menu' }).click();
  await page.getByRole('button', { name: 'English' }).last().click();
  await expect(page).toHaveURL(/\?lang=en/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Map. Analyze. Simulate. Improve.');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('DeliR | Process Intelligence for BPM & Operations Consultants');
  await page.goto('/pilot?lang=en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Test DeliR on Your Project.');
  await expect(page).toHaveTitle(/DeliR pilot/);
});
