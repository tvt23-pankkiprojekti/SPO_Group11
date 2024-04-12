const jwt = require("jsonwebtoken");
const { API } = require("../../src/config");
const Response = require("../../src/responses");

test("with_card: correct pin full", async () => {
    const card = await fetch(`${API.url()}/api/card`, {
        method: "POST",
        body: JSON.stringify({
            User_id: 2,
            pinHash: "hash",
            number: "1000200030004002",
            frozen: 0,
            failedPinAttempts: 0
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    const id = await card.text();

    await fetch(`${API.url()}/api/card_account`, {
        method: "POST",
        body: JSON.stringify({
            Account_id: 1,
            Card_id: id
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const result = await fetch(`${API.url()}/api/login/with_card/1000200030004002`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(200);

    const json = await result.json();
    expect(json).toHaveProperty("token");

    const decoded = jwt.decode(json.token, API.SECRET);
    expect(decoded.accountIds.length).toEqual(1);
});

test("with_card: correct pin partial", async () => {
    const card = await fetch(`${API.url()}/api/card`, {
        method: "POST",
        body: JSON.stringify({
            User_id: 2,
            pinHash: "hash",
            number: "1000200030004003",
            frozen: 0,
            failedPinAttempts: 0
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    const id = await card.text();

    await fetch(`${API.url()}/api/card_account`, {
        method: "POST",
        body: JSON.stringify({
            Account_id: 1,
            Card_id: id
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    await fetch(`${API.url()}/api/card_account`, {
        method: "POST",
        body: JSON.stringify({
            Account_id: 2,
            Card_id: id
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const result = await fetch(`${API.url()}/api/login/with_card/1000200030004003`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(200);

    const json = await result.json();
    expect(json).toHaveProperty("token");

    const decoded = jwt.decode(json.token, API.SECRET);
    expect(decoded.accountIds.length).toEqual(2);
});

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
});

test("with_type: correct token", async () => {
    const card = await fetch(`${API.url()}/api/card`, {
        method: "POST",
        body: JSON.stringify({
            User_id: 2,
            pinHash: "hash",
            number: "1000200030004004",
            frozen: 0,
            failedPinAttempts: 0
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    const id = await card.text();

    await fetch(`${API.url()}/api/card_account`, {
        method: "POST",
        body: JSON.stringify({
            Account_id: 1,
            Card_id: id
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    await fetch(`${API.url()}/api/card_account`, {
        method: "POST",
        body: JSON.stringify({
            Account_id: 4,
            Card_id: id
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const tokenResult = await fetch(`${API.url()}/api/login/with_card/1000200030004004`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    const token = (await tokenResult.json()).token;

    const resultDebit = await fetch(`${API.url()}/api/login/with_type/1000200030004004`, {
        method: "POST",
        body: JSON.stringify({ token: token, type: "debit" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(resultDebit.status).toEqual(200);

    const jsonDebit = await resultDebit.json();
    expect(jsonDebit).toHaveProperty("token");

    const decodedDebit = jwt.decode(jsonDebit.token, API.SECRET);
    expect(decodedDebit).toHaveProperty("idAccount");

    const resultCredit = await fetch(`${API.url()}/api/login/with_type/1000200030004004`, {
        method: "POST",
        body: JSON.stringify({ token: token, type: "credit" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(resultCredit.status).toEqual(200);

    const jsonCredit = await resultCredit.json();
    expect(jsonCredit).toHaveProperty("token");

    const decodedCredit = jwt.decode(jsonCredit.token, API.SECRET);
    expect(decodedCredit).toHaveProperty("idAccount");
});

test("with_type: incorrect token", async () => {
    const result = await fetch(`${API.url()}/api/login/with_type/1000200030004004`, {
        method: "POST",
        body: JSON.stringify({ token: "incorrect", type: "debit" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(403);
});

test("with_type: missing parameters", async () => {
    const resultToken = await fetch(`${API.url()}/api/login/with_type/1000200030004004`, {
        method: "POST",
        body: JSON.stringify({ type: "debit" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(resultToken.status).toEqual(400);
    expect(await resultToken.json()).toHaveProperty("code", Response.MISSING_PARAMETERS);

    const resultType = await fetch(`${API.url()}/api/login/with_type/1000200030004004`, {
        method: "POST",
        body: JSON.stringify({ token: "token" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(resultType.status).toEqual(400);
    expect(await resultType.json()).toHaveProperty("code", Response.MISSING_PARAMETERS);
});
