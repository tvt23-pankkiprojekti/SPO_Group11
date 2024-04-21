const { API } = require('../../src/config.js');
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluMSIsImlhdCI6MTcxMzczNTI2OX0.wXnXwGhwDDLSC8_KivnImFd0CFs4anm75xzOkLYrigg';

test('get all transactions', async()=>{
    const res = await fetch(`${API.url()}/admin/api/transaction`, {headers: {"Authorization": adminToken}});

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual(expect.any(Object));
});

test('get one transaction', async()=>{
    const res = await fetch(`${API.url()}/admin/api/transaction/10`, {headers: {"Authorization": adminToken}});


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
        headers: {"Content-Type": "application/json", "Authorization": adminToken},
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
        headers: {"Content-Type": "application/json", "Authorization": adminToken},
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
        headers: {"Content-Type": "application/json", "Authorization": adminToken},
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
