const { API } = require('../../src/config.js');

test('get all transactions', async()=>{
    const res = await fetch(`${API.url()}/admin/api/transaction`);

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual(expect.any(Object));
});

test('get one transaction', async()=>{
    const res = await fetch(`${API.url()}/admin/api/transaction/10`);


    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
        idTransaction: 10,
        Account_id: 10,
        dateTime:  expect.any(String),
        balanceChange: '400.00',
        transactionType: 'deposit'
    });
});


test('add transaction', async()=>{
    const res = await fetch(`${API.url()}/admin/api/transaction`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({Account_id: '2', dateTime: '2024-04-03 15:00:00', balanceChange: '10.99', transactionType: 'deposit'})
    });

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: expect.any(Number),
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
    });
});

test('update transaction', async()=>{
    const res = await fetch(`${API.url()}/admin/api/transaction/10`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({Account_id: '2', dateTime: '2024-04-04 15:00:00', balanceChange: '-0.99', transactionType: 'withdraw'})
    });

    expect(res.status).toEqual(200);

    expect(await res.json()).toEqual({
      fieldCount: 0,
      affectedRows: 1,
      insertId: 0,
      info: 'Rows matched: 1  Changed: 1  Warnings: 0',
      serverStatus: 2,
      warningStatus: 0,
      changedRows: 1
    });
});

test('delete transaction', async()=>{
    const res = await fetch(`${API.url()}/admin/api/transaction/10`, {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
    });

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
    });
});
