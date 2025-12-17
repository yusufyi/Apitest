import { test, expect } from "@playwright/test";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

test("GET /products -> returns list + pagination fields", async ({ request }) => {
  const res = await request.get("https://dummyjson.com/products");
  expect(res.status()).toBe(200);

  const body = await res.json();

  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);
  expect(typeof body.total).toBe("number");
  expect(typeof body.skip).toBe("number");
  expect(typeof body.limit).toBe("number");

  const first = body.products[0];
  expect(typeof first.id).toBe("number");
  expect(isNonEmptyString(first.title)).toBeTruthy();
  expect(typeof first.price).toBe("number");
  expect(isNonEmptyString(first.thumbnail)).toBeTruthy();
});

test("GET /products/1 -> returns product with id=1", async ({ request }) => {
  const res = await request.get("https://dummyjson.com/products/1");
  expect(res.status()).toBe(200);

  const p = await res.json();
  expect(p.id).toBe(1);
  expect(isNonEmptyString(p.title)).toBeTruthy();
  expect(typeof p.price).toBe("number");
});

test("GET /products/search?q=phone -> returns products array", async ({ request }) => {
  const res = await request.get("https://dummyjson.com/products/search?q=phone");
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(Array.isArray(body.products)).toBe(true);
  expect(typeof body.total).toBe("number");
});

test("GET /products?limit=10&skip=10&select=title,price -> returns 10 items with only fields", async ({ request }) => {
  const res = await request.get(
    "https://dummyjson.com/products?limit=10&skip=10&select=title,price"
  );
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.limit).toBe(10);
  expect(body.skip).toBe(10);
  expect(body.products.length).toBe(10);

  const first = body.products[0];
  expect(typeof first.id).toBe("number");        // DummyJSON örneğinde id de geliyor  [oai_citation:1‡DummyJSON](https://dummyjson.com/docs/products)
  expect(isNonEmptyString(first.title)).toBeTruthy();
  expect(typeof first.price).toBe("number");

  // select=title,price verdik; diğer alanlar genelde gelmemeli
  expect(first.description).toBeUndefined();
  expect(first.thumbnail).toBeUndefined();
});

test("GET /products?sortBy=title&order=asc -> returns list", async ({ request }) => {
  const res = await request.get("https://dummyjson.com/products?sortBy=title&order=asc");
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);

  // basit sıralama kontrolü: ilk iki title asc
  const t1 = body.products[0].title;
  const t2 = body.products[1].title;
  expect(String(t1).localeCompare(String(t2))).toBeLessThanOrEqual(0);
});