const { API } = require("../../src/config");

test("create a card_account entry", async () => {
    const result = await fetch(`${API.url()}/api/card_account`, {
        method: "POST",
        body: JSON.stringify({
            Card_id: 1,
            Account_id: 1
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(201);
    expect(await result.text()).toEqual("11");
});

test("create a card_account entry without a body", async () => {
    const result = await fetch(`${API.url()}/api/card_account`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(400);
});

test("get all card_account entries", async () => {
    const result = await fetch(`${API.url()}/api/card_account`);
    expect(result.status).toEqual(200);
});

test("get a card_account entry", async () => {
    const result = await fetch(`${API.url()}/api/card_account/1`);
    expect(result.status).toEqual(200);
});

test("get a card_account entry that does not exist", async () => {
    const result = await fetch(`${API.url()}/api/card_account/0`);
    expect(result.status).toEqual(404);
});

test("update a card_account entry", async () => {
    const result = await fetch(`${API.url()}/api/card_account/11`, {
        method: "PUT",
        body: JSON.stringify({
            Card_id: 2,
            Account_id: 2
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(200);
});

test("update a card_account entry without a body", async () => {
    const result = await fetch(`${API.url()}/api/card_account/11`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(400);
});

test("update a card_account entry that does not exist", async () => {
    const result = await fetch(`${API.url()}/api/card_account/0`, {
        method: "PUT",
        body: JSON.stringify({
            Card_id: 2,
            Account_id: 2
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(404);
});

test("delete a card_account entry", async () => {
    const result = await fetch(`${API.url()}/api/card_account/11`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(200);
});

test("delete a card_account entry that does not exist", async () => {
    const result = await fetch(`${API.url()}/api/card_account/0`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(result.status).toEqual(404);
});
