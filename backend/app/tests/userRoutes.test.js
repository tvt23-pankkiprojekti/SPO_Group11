const config = require('../src/config.js');

//test.only(...) jos haluaa testata vain yhtä

test('get all users', async () => {
    const res = await fetch(`http://localhost:${config.PORT}/api/user/all`);

    console.log(await res.json());
});


test('get one user', async ()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/user/10`);

    console.log(await res.json());
});

test('add user', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/user`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({firstName: 'Mikko', lastName: 'Mallikas'})
    });

    console.log(await res.json());
});

test('update user', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/user/10`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({firstName: 'Jokke', lastName: 'Kariseva'})
    });

    console.log(await res.json());
});

test('delete user', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/user/9`, {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
    });

    console.log(await res.json());
});

