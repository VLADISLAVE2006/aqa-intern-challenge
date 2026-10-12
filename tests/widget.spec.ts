import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page, context}) => {
    widgetPage = new WidgetPage(page);

    // uchi.ru randomly serves A/B variants of the main page; the redesign variant ("b") has no support widget
    await context.addCookies([{name: 'ab_mainpage_redesign', value: 'a', domain: 'uchi.ru', path: '/'}]);

    // open uchi.ru main page
    await page.goto('/');

    // close cookies popup
    await page.click('._UCHI_COOKIE__button');
  });

  test('opens', async ({page}) => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible()
  });

  test('has correct title', async ({ page }) => {
    await widgetPage.openWidget();

    await widgetPage.getPopularArticles().first().click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой');
  });
});
