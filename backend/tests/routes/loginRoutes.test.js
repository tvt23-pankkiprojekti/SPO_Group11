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
    });

    expect(result.status).toEqual(404);
    expect(await result.json()).toHaveProperty("code", Response.CARD_NOT_FOUND);
});

test("with_card: incorrect pin", async () => {
    await fetch(`${API.url()}/api/card`, {
        method: "POST",
        body: JSON.stringify({
            User_id: 1,
            pinHash: "hash",
            number: "1000200030004001",
            frozen: 0,
            failedPinAttempts: 0
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const result = await fetch(`${API.url()}/api/login/with_card/1000200030004001`, {
        method: "POST",
        body: JSON.stringify({ pin: "incorrect" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(401);
    expect(await result.json()).toHaveProperty("code", Response.INCORRECT_PIN);
});

test("with_card: card frozen", async () => {
    await fetch(`${API.url()}/api/card`, {
        method: "POST",
        body: JSON.stringify({
            User_id: 1,
            pinHash: "hash",
            number: "1000200030004000",
            frozen: 1,
            failedPinAttempts: 0
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const result = await fetch(`${API.url()}/api/login/with_card/1000200030004000`, {
        method: "POST",
        body: JSON.stringify({ pin: "1234" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(403);
    expect(await result.json()).toHaveProperty("code", Response.CARD_FROZEN);
});

test("with_card: no account linked", async () => {
    const result = await fetch(`${API.url()}/api/login/with_card/1000200030004001`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(404);
    expect(await result.json()).toHaveProperty("code", Response.NO_ACCOUNT_LINKED);
});

test("with_card: missing pin", async () => {
    const result = await fetch(`${API.url()}/api/login/with_card/1000200030004001`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(400);
    expect(await result.json()).toHaveProperty("code", Response.MISSING_PARAMETERS);
})
