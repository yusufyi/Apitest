import { test, expect } from '@playwright/test';


test('products API returns expected data', async ({ request }) => {
  const res = await request.get("https://dummyjson.com/products");
  console.log(await res.status());
  expect(res.status()).toBe(200);

  const body = await res.json();
expect(Array.isArray(body.products)).toBe(true);

  

});