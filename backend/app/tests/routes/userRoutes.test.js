const config = require('../../src/config.js');

test('get all users', async ()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/user`);
    
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([
        { idUser: 1, firstName: 'John', lastName: 'Doe' },
        { idUser: 2, firstName: 'Alice', lastName: 'Smith' },
        { idUser: 3, firstName: 'Michael', lastName: 'Johnson' },
        { idUser: 4, firstName: 'Emily', lastName: 'Brown' },
        { idUser: 5, firstName: 'Daniel', lastName: 'Williams' },
        { idUser: 6, firstName: 'Sarah', lastName: 'Taylor' },
        { idUser: 7, firstName: 'Christopher', lastName: 'Anderson' },
        { idUser: 8, firstName: 'Emma', lastName: 'Martinez' },
        { idUser: 9, firstName: 'David', lastName: 'Garcia' },
        { idUser: 10, firstName: 'Olivia', lastName: 'Miller' }
    ]);
});

test('get one user', async ()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/user/10`);
 
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
        idUser: 10, 
        firstName: 'Olivia', 
        lastName: 'Miller' 
    });
});

test('add user', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/user`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({firstName: 'Mikko', lastName: 'Mallikas'})
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

test('update user', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/user/10`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({firstName: 'Jokke', lastName: 'Kariseva'})
    });

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
        fieldCount: 0,
        affectedRows: 0,
        insertId: 0,
        info: 'Rows matched: 0  Changed: 0  Warnings: 0',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
    });
});

test('delete user', async()=>{
    const res = await fetch(`http://localhost:${config.PORT}/api/user/9`, {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
    });

    expect(res.status).toEqual(400);
});

