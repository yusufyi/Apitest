import { test, expect } from '@playwright/test';


test('products API returns expected data', async ({ request }) => {
  const res = await request.get("https://dummyjson.com/products");
  console.log(await res.status());
  expect(res.status()).toBe(200);

  const body = await res.json();
  console.log(body);
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);
  expect(typeof body.total).toBe("number");
  expect(typeof body.skip).toBe("number");
  expect(typeof body.limit).toBe("number");
  

});

test("GET /products/1 -> returns product with id=1", async ({ request }) => {
  const res = await request.get("https://dummyjson.com/products/1");
  expect(res.status()).toBe(200);

  const p = await res.json();
  expect(p.id).toBe(1);
  expect(typeof p.price).toBe("number");
});