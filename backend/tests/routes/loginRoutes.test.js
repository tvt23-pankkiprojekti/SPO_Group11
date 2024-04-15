const { API } = require("../../src/config");

let debitCardId;

test("login: debit", async () => {
    const card = await fetch(`${API.url()}/api/card`, {
        method: "POST",
        body: JSON.stringify({
            User_id: 1,
            pinHash: "hash",
            number: "1000200030004000",
            frozen: 0,
            failedPinAttempts: 0
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    debitCardId = await card.text();

    await fetch(`${API.url()}/api/card_account`, {
        method: "POST",
        body: JSON.stringify({
            Account_id: 1,
            Card_id: debitCardId
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const result = await fetch(`${API.url()}/api/login/1000200030004000`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(200);

    const json = await result.json();
    expect(json).toHaveProperty("debit");
});

test("login: credit", async () => {
    const card = await fetch(`${API.url()}/api/card`, {
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
    const id = await card.text();

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

    const result = await fetch(`${API.url()}/api/login/1000200030004001`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(200);

    const json = await result.json();
    expect(json).toHaveProperty("credit");
});

test("login: debit/credit", async () => {
    await fetch(`${API.url()}/api/card_account`, {
        method: "POST",
        body: JSON.stringify({
            Account_id: 4,
            Card_id: debitCardId
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const result = await fetch(`${API.url()}/api/login/1000200030004000`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(200);

    const json = await result.json();
    expect(json).toHaveProperty("debit");
    expect(json).toHaveProperty("credit");
});

test("card not found", async () => {
    const result = await fetch(`${API.url()}/api/login/0`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(404);
});

test("incorrect pin", async () => {
    const result = await fetch(`${API.url()}/api/login/1000200030004000`, {
        method: "POST",
        body: JSON.stringify({ pin: "incorrect" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(401);
});

test("card frozen", async () => {
    await fetch(`${API.url()}/api/card`, {
        method: "POST",
        body: JSON.stringify({
            User_id: 1,
            pinHash: "hash",
            number: "1000200030004002",
            frozen: 1,
            failedPinAttempts: 0
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const result = await fetch(`${API.url()}/api/login/1000200030004002`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(403);
});

test("no account linked", async () => {
    await fetch(`${API.url()}/api/card`, {
        method: "POST",
        body: JSON.stringify({
            User_id: 1,
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

    const result = await fetch(`${API.url()}/api/login/1000200030004003`, {
        method: "POST",
        body: JSON.stringify({ pin: "hash" }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(404);
});

test("missing parameters", async () => {
    const result = await fetch(`${API.url()}/api/login/1000200030004000`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(400);
});
