const config = require('../src/config.js');

test('get all transactions', async () => {
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction/all`);

    console.log(await res.json());
});


test('get one transaction', async ()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction/10`);

    console.log(await res.json());
});

test('add transaction', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({Card_id: '1', Account_id: '2', dateTime: '2024-04-03 15:00:00', balanceChange: '10.99', transactionType: 'deposit'})
    });

    console.log(await res.json());
});

test('update transaction', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction/10`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({Card_id: '1', Account_id: '2', dateTime: '2024-04-04 15:00:00', balanceChange: '-0.99', transactionType: 'withdraw'})
    });

    console.log(await res.json());
});

test('delete transaction', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/transaction/9`, {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
    });

    console.log(await res.json());
});

