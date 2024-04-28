import request from "supertest";
import app from "./src/app";
import { bootstrapDB } from "./src/databaseConfig/bootstrapDb";

beforeAll(async () => {
  await bootstrapDB();
});

describe("Test 1: Integration test for createUser Api", () => {
  test("Create an account and validate using GET", async () => {
    const reqBody = {
      first_name: "Ashish",
      last_name: "Badhe",
      username: "testuser99@gmail.com",
      password: "ashish@123",
    };

    const postUserResponse = await request(app).post("/v2/user").send(reqBody);
    await expect(postUserResponse.statusCode).toBe(201);
    expect(postUserResponse.body.id).toBeTruthy();

    const base64Token = Buffer.from(`${reqBody.username}:${reqBody.password}`).toString("base64");
    const getUserResponse = await request(app).get("/v2/user/self").send().set("Authorization", `Basic ${base64Token}`);
    expect(getUserResponse.statusCode).toBe(200);
    expect(getUserResponse.body.id).toBe(postUserResponse.body.id);
    expect(getUserResponse.body.username).toBe(postUserResponse.body.username);
  });
});

describe("Test 2:  Integration test for createUser Api", () => {
    test("Update an account and validate using GET", async () => {

        const reqBody = {
          first_name: "ABC",
          last_name: "XYZ",
          password: "test@123",
        };

        const authtoken = {
            username: "testuser99@gmail.com",
            password: "ashish@123",
        }
    
        const base64TokenforPut = Buffer.from(`${authtoken.username}:${authtoken.password}`).toString("base64");
        const putUserResponse = await request(app).put("/v2/user/self").send(reqBody).set("Authorization", `Basic ${base64TokenforPut}`);;
        await expect(putUserResponse.statusCode).toBe(204);
    
        const base64Token = Buffer.from(`${authtoken.username}:${reqBody.password}`).toString("base64");
        const getUserResponse = await request(app).get("/v2/user/self").send().set("Authorization", `Basic ${base64Token}`);
        expect(getUserResponse.statusCode).toBe(200);
        expect(getUserResponse.body.username).toBe(authtoken.username);
        expect(getUserResponse.body.first_name).toBe(reqBody.first_name);
        expect(getUserResponse.body.last_name).toBe(reqBody.last_name);
      });
});
