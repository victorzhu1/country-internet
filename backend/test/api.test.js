const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const InternetStatistics = require("../models/Statistics");

const TEST_API_KEY = "victor1234567890";
const WRONG_TEST_API_KEY = "victor1234567899";

describe("Internet Statistics API", () => {
  let testData;

  beforeAll(async () => {
    testData = await InternetStatistics.findOne({ countryCode: "WW" });

    if (!testData) {
      throw new Error("Test data not found in database. Ensure there is an entry for 'WW'.");
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET /api/statistics/:countryCode should return country stats", async () => {
    const res = await request(app)
      .get(`/api/statistics/${testData.countryCode}`)
      .set("x-api-key", TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(res.body.countryCode).toBe(testData.countryCode);
    expect(res.body.rate_wb).toBe(testData.rate_wb);
  });

  test("GET /api/statistics/:countryCode should return country stats", async () => {
    const res = await request(app)
      .get(`/api/statistics/${testData.countryCode}`)
      .set("x-api-key", WRONG_TEST_API_KEY);

    expect(res.status).toBe(403);
  });

  test("PUT /api/statistics/:countryCode should update rate_wb", async () => {
    const newRate = testData.rate_wb + 1;

    const res = await request(app)
      .put(`/api/statistics/${testData.countryCode}`)
      .set("x-api-key", TEST_API_KEY)
      .send({ rate_wb: newRate });

    expect(res.status).toBe(200);
    expect(res.body.rate_wb).toBe(newRate);
    expect(res.body.year_wb).toBe(new Date().getFullYear());
  });

  test("PUT /api/statistics/:countryCode should reject invalid rate_wb", async () => {
    const res = await request(app)
      .put(`/api/statistics/${testData.countryCode}`)
      .set("x-api-key", TEST_API_KEY)
      .send({ rate_wb: 150 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Rate must be between 0 and 100");
  });

  test("GET /api/statistics/:countryCode should return 404 for non-existing country", async () => {
    const res = await request(app)
      .get("/api/statistics/ZZZ")
      .set("x-api-key", TEST_API_KEY);

    expect(res.status).toBe(404);
  });
});
