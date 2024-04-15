const bcrypt = require('bcrypt');
const { API } = require('../../src/config.js');

test('create administrator', async () => {
    const result = await fetch(
        `${API.url()}/api/administrator`,
        {
            method: 'POST',
            body: JSON.stringify({
                login: 'admin4',
                password: 'secretpassword'
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }
    );

    expect(result.status).toEqual(200);
    expect(await result.json()).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 4,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
    });
});

test('update administrator', async () => {
    const result = await fetch(
        `${API.url()}/api/administrator/4`,
        {
            method: 'PUT',
            body: JSON.stringify({password: 'changedpassword'}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
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

test('get all administrators', async () => {
    const result = await fetch(
        `${API.url()}/api/administrator`,
        {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }
    );

    expect(result.status).toEqual(200);
    const resultJson = await result.json();

    expect(resultJson).toEqual([
        { idAdministrator: 1, login: 'admin1', passwordHash: 'hash1' },
        { idAdministrator: 2, login: 'admin2', passwordHash: 'hash2' },
        { idAdministrator: 3, login: 'admin3', passwordHash: 'hash3' },
        { idAdministrator: 4, login: 'admin4', passwordHash: expect.any(String) }
    ]);

    expect(bcrypt.compareSync(
        'changedpassword',
        resultJson[3].passwordHash)
    ).toBe(true);
});

test('delete administrator', async () => {
    const result = await fetch(
        `${API.url()}/api/administrator/1`,
        {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
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
