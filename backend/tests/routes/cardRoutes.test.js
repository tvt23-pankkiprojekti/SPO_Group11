const { API } = require("../../src/config.js");
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluMSIsImlhdCI6MTcxMzczNTI2OX0.wXnXwGhwDDLSC8_KivnImFd0CFs4anm75xzOkLYrigg';

test("create a card entry", async () => {
    const result = await fetch(`${API.url()}/admin/api/card`, {
        method: "POST",
        body: JSON.stringify({
            User_id: 1,
            pinHash: "hash",
            number: "1111222233334444",
            frozen: 0,
            failedPinAttempts: 0
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": adminToken
        }
    });

    expect(result.status).toEqual(201);
    // expect(await result.text()).toEqual("12");
});

test("create a card entry without a body", async () => {
    const result = await fetch(`${API.url()}/admin/api/card`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": adminToken
        }
    });

    expect(result.status).toEqual(400);
});

test("get all card entries", async () => {
    const result = await fetch(`${API.url()}/admin/api/card`, {headers: {"Authorization": adminToken}});
    expect(result.status).toEqual(200);
});

test("get a card entry", async () => {
    const result = await fetch(`${API.url()}/admin/api/card/1`, {headers: {"Authorization": adminToken}});
    expect(result.status).toEqual(200);
});

test("get a card entry that does not exist", async () => {
    const result = await fetch(`${API.url()}/admin/api/card/0`, {headers: {"Authorization": adminToken}});
    expect(result.status).toEqual(404);
});

test("update a card entry", async () => {
    const result = await fetch(`${API.url()}/admin/api/card/11`, {
        method: "PUT",
        body: JSON.stringify({
            User_id: 2,
            pinHash: "hsah",
            number: "4444333322221111",
            frozen: 1,
            failedPinAttempts: 2
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": adminToken
        }
    });

    expect(result.status).toEqual(200);
});

test("update a card entry without a body", async () => {
    const result = await fetch(`${API.url()}/admin/api/card/11`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": adminToken
        }
    });

    expect(result.status).toEqual(400);
});

test("update a card entry that does not exist", async () => {
    const result = await fetch(`${API.url()}/admin/api/card/0`, {
        method: "PUT",
        body: JSON.stringify({
            User_id: 2,
            pinHash: "hsah",
            number: "4444333322221111",
            frozen: 1,
            failedPinAttempts: 2
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": adminToken
        }
    });

    expect(result.status).toEqual(404);
});


test("delete a card entry", async () => {
    await fetch(`${API.url()}/admin/api/card_account/5`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": adminToken
        }
    });

    const result = await fetch(`${API.url()}/admin/api/card/5`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": adminToken
        }
    });

    expect(result.status).toEqual(200);
});

test("delete a card entry that does not exist", async () => {
    const result = await fetch(`${API.url()}/admin/api/card/0`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": adminToken
        }
    });

    expect(result.status).toEqual(404);
});
