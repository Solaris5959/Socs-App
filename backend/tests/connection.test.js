// tests/unit/connections.test.js

import request from "supertest";
import app from "../src/server";

const userA = { email: process.env.AUTH_USER, password: process.env.AUTH_PASS };
const userB = {
  email: process.env.AUTH_USER2,
  password: process.env.AUTH_PASS2,
};

describe("/ connections routes", () => {
  let tokenA, tokenB, userIdA, userIdB;

  beforeAll(async () => {
    const loginA = await request(app)
      .post("/socs/api/v1/user/login")
      .send(userA);
    const loginB = await request(app)
      .post("/socs/api/v1/user/login")
      .send(userB);

    tokenA = loginA.body.session.access_token;
    tokenB = loginB.body.session.access_token;
    userIdA = loginA.body.session.user.id;
    userIdB = loginB.body.session.user.id;
  });

  test("User A follows User B", async () => {
    const res = await request(app)
      .post("/socs/api/v1/connections/follow")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ followed_id: userIdB });

    expect(res.statusCode).toBe(201);
    expect(res.body.follower_id).toBeDefined();
    expect(res.body.followed_id).toBe(userIdB);
  });

  test("User A requests connection with User B (already following)", async () => {
    const res = await request(app)
      .post("/socs/api/v1/connections/requests")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ recipient_id: userIdB });

    expect(res.statusCode).toBe(201);
    expect(res.body.requester_id).toBeDefined();
    expect(res.body.recipient_id).toBe(userIdB);
  });

  test("User B accepts connection request, creates connection and removes follows", async () => {
    const res = await request(app)
      .post("/socs/api/v1/connections")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ other_user_id: userIdA });

    expect(res.statusCode).toBe(201);
    expect(res.body.user_a).toBeDefined();
    expect(res.body.user_b).toBeDefined();
  });

  test("Query connections for User B", async () => {
    const res = await request(app)
      .get("/socs/api/v1/connections")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("User B deletes the connection", async () => {
    const res = await request(app)
      .delete(`/socs/api/v1/connections/${userIdA}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.statusCode).toBe(200);
  });
});
