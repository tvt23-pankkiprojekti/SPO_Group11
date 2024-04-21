const { API } = require('../../src/config.js');
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluMSIsImlhdCI6MTcxMzczNTI2OX0.wXnXwGhwDDLSC8_KivnImFd0CFs4anm75xzOkLYrigg';

test('create friend', async () => {
    const result = await fetch(
        `${API.url()}/admin/api/friend`,
        {
            method: 'POST',
            body: JSON.stringify({User_id: 1, Account_id: 10}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": adminToken
            }
        }
    );

    expect(result.status).toEqual(200);
    expect(await result.json()).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 3,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
    });
});

test('update friend', async () => {
    const result = await fetch(
        `${API.url()}/admin/api/friend/3`,
        {
            method: 'PUT',
            body: JSON.stringify({Account_id: 2}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": adminToken
            }
        }
    );

    expect(result.status).toEqual(200);
    expect(await result.json()).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: 'Rows matched: 1  Changed: 1  Warnings: 0',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 1
    });
});

test('get all friends', async () => {
    const result = await fetch(
        `${API.url()}/admin/api/friend`,
        {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": adminToken
            }
        }
    );

    expect(result.status).toEqual(200);
    expect(await result.json()).toEqual([
        { idFriend: 1, User_id: 1, Account_id: 2 },
        { idFriend: 2, User_id: 7, Account_id: 10 },
        { idFriend: 3, User_id: 1, Account_id: 2 }
    ]);
});

test('delete friend', async () => {
    const result = await fetch(
        `${API.url()}/admin/api/friend/1`,
        {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": adminToken
            }
        }
    );

    expect(result.status).toEqual(200);
    expect(await result.json()).toEqual({
       fieldCount: 0,
       affectedRows: 1,
       insertId: 0,
       info: '',
       serverStatus: 2,
       warningStatus: 0,
       changedRows: 0
    });
});
