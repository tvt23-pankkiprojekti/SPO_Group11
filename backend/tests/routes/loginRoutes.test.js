const { API } = require("../../src/config");
const Response = require("../../src/responses");

test("with_card: missing parameters", async () => {
    const result = await fetch(`${API.url()}/api/login/with_card/1`, {
        method: "POST",
    });
    expect(result.status).toEqual(400);
    expect(await result.json()).toHaveProperty("code", Response.MISSING_PARAMETERS);
});

test("with_card: card not found", async () => {
    const result = await fetch(`${API.url()}/api/login/with_card/0`, {
        method: "POST",
        body: JSON.stringify({ pin: "1234" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    expect(result.status).toEqual(404);
    expect(await result.json()).toHaveProperty("code", Response.CARD_NOT_FOUND);
});
