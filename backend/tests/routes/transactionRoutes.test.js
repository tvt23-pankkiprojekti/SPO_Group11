const config = require('../../src/config.js');

test('get all transactions', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction`);

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([
        {
          idTransaction: 1,
          Account_id: 1,
          dateTime: expect.any(String),
          balanceChange: '-50.00',
          transactionType: 'withdraw'
        },
        {
          idTransaction: 2,
          Account_id: 2,
          dateTime: expect.any(String),
          balanceChange: '100.00',
          transactionType: 'deposit'
        },
        {
          idTransaction: 3,
          Account_id: 3,
          dateTime: expect.any(String),
          balanceChange: '-20.00',
          transactionType: 'withdraw'
        },
        {
          idTransaction: 4,
          Account_id: 4,
          dateTime: expect.any(String),
          balanceChange: '200.00',
          transactionType: 'deposit'
        },
        {
          idTransaction: 5,
          Account_id: 5,
          dateTime: expect.any(String),
          balanceChange: '-10.00',
          transactionType: 'withdraw'
        },
        {
          idTransaction: 6,
          Account_id: 6,
          dateTime: expect.any(String),
          balanceChange: '50.00',
          transactionType: 'deposit'
        },
        {
          idTransaction: 7,
          Account_id: 7,
          dateTime: expect.any(String),
          balanceChange: '-30.00',
          transactionType: 'withdraw'
        },
        {
          idTransaction: 8,
          Account_id: 8,
          dateTime: expect.any(String),
          balanceChange: '300.00',
          transactionType: 'deposit'
        },
        {
          idTransaction: 9,
          Account_id: 9,
          dateTime: expect.any(String),
          balanceChange: '-40.00',
          transactionType: 'withdraw'
        },
        {
          idTransaction: 10,
          Account_id: 10,
          dateTime: expect.any(String),
          balanceChange: '400.00',
          transactionType: 'deposit'
        }
    ]);
});

test('get one transaction', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction/10`);
    

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
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({Account_id: '2', dateTime: '2024-04-03 15:00:00', balanceChange: '10.99', transactionType: 'deposit'})
    });

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 11,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
    });
});

test('update transaction', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction/10`, {
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
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction/10`, {
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
