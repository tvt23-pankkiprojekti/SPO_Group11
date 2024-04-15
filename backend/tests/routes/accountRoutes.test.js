const { API } = require('../../src/config.js');

test('insert account', async ()=>{
    const result = await fetch(`${API.url()}/admin/api/account`,
    {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            User_id: 1,
            type: 'debit',
            balance: 1000.00,
            limit: 0.00,
        })
    });

    expect(result.status).toEqual(200);

});

test('get one account', async ()=>{
    const result = await fetch(`${API.url()}/admin/api/account/1`);

    expect(result.status).toEqual(200);
    expect(await result.json()).toEqual({
        User_id: 1,
        balance: expect.any(String),
        idAccount: 1,
        limit: "0.00",
        type: 'debit',
        accountNumber: expect.any(String)
    });
});

test('get all accounts', async ()=>{
    const result = await fetch(`${API.url()}/admin/api/account`);

    expect(result.status).toEqual(200);
});

test('update account', async()=>{
    const result = await fetch(`${API.url()}/admin/api/account/1`,
    {
    method: 'PUT',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({User_id: 2}),
    });
    expect(result.status).toEqual(200);
});

test('delete account', async () =>{
    const result = await fetch(`${API.url()}/admin/api/account/1`,
    {
        method: 'DELETE',
    });
    expect(result.status).toEqual(400);
});
