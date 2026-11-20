import { expect, test } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: '643d69a5c3f7b9001cfa093c',
              name: 'Краторная булка N-200i',
              type: 'bun',
              proteins: 80,
              fat: 24,
              carbohydrates: 53,
              calories: 420,
              price: 1255,
              image: 'https://code.s3.yandex.net/react/code/bun-02.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
            },
            {
              _id: '643d69a5c3f7b9001cfa0941',
              name: 'Биокотлета из марсианской Магнолии',
              type: 'main',
              proteins: 420,
              fat: 142,
              carbohydrates: 242,
              calories: 4242,
              price: 424,
              image: 'https://code.s3.yandex.net/react/code/meat-01.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
            },
            {
              _id: '643d69a5c3f7b9001cfa0942',
              name: 'Соус Spicy-X',
              type: 'sauce',
              proteins: 30,
              fat: 20,
              carbohydrates: 40,
              calories: 30,
              price: 90,
              image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
            },
          ],
        }),
      });
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.ru', name: 'Тест' },
        }),
      });
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            name: 'Бургер',
            order: { number: 12345 },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await context.addCookies([
      { name: 'accessToken', value: 'Bearer mock-token', domain: 'localhost', path: '/' },
    ]);
    
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh');
    });

    await page.goto('/');
    
    await expect(page.getByText('Краторная булка N-200i').first()).toBeVisible({
      timeout: 10000,
    });
  });

  test('добавление ингредиента из списка в конструктор', async ({ page }) => {
    const addButtons = page.getByText('Добавить');
    await expect(addButtons.first()).toBeVisible();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    await addButtons.first().click();
    await expect(page.getByTestId('constructor-bun-1')).toBeVisible();
    await expect(page.getByTestId('constructor-bun-2')).toBeVisible();

    await addButtons.nth(1).click();
    await expect(page.getByTestId('constructor-ingredients')).not.toContainText(
      'Выберите начинку'
    );
  });

  test('модальное окно ингредиента: данные, закрытие по крестику и оверлею', async ({
    page,
  }) => {
    const firstCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();

    await firstCard.locator('a').click();
    
    const modalTitle = page.getByRole('heading', { name: 'Детали ингредиента' });
    await expect(modalTitle).toBeVisible();

    await expect(page.getByText('80', { exact: true })).toBeVisible();
    await expect(page.getByText('24', { exact: true })).toBeVisible();
    await expect(page.getByText('53', { exact: true })).toBeVisible();
    await expect(page.getByText('420', { exact: true })).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i')).toHaveCount(2);

    await page.locator('button[aria-label="Закрыть"]').click();
    await expect(modalTitle).toBeHidden();
    await expect(page.getByText('Краторная булка N-200i')).toHaveCount(1);

    await firstCard.locator('a').click();
    await expect(modalTitle).toBeVisible();
    
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modalTitle).toBeHidden();
  });

  test('удаление начинки по id: вторая сохраняется', async ({ page }) => {
    const addButtons = page.getByText('Добавить');

    await addButtons.first().click();
    await addButtons.nth(1).click();
    await addButtons.nth(2).click();

    const constructor = page.getByTestId('constructor-ingredients');
    await expect(constructor).toContainText('Биокотлета из марсианской Магнолии');
    await expect(constructor).toContainText('Соус Spicy-X');

    const firstItem = constructor.locator('li').first();
    await firstItem.locator('.constructor-element__action').click();

    await expect(constructor).not.toContainText('Биокотлета из марсианской Магнолии');
    await expect(constructor).toContainText('Соус Spicy-X');
  });

  test('создание заказа: номер заказа и очистка конструктора', async ({
    page,
  }) => {
    const addButtons = page.getByText('Добавить');

    await addButtons.first().click();
    await addButtons.nth(1).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('order-number')).toHaveText('12345');
    await expect(page.getByTestId('constructor-bun-1')).toBeHidden();
    await expect(page.getByTestId('constructor-bun-2')).toBeHidden();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.locator('button[aria-label="Закрыть"]').click();
    await expect(page.getByTestId('order-number')).toBeHidden();
  });
});