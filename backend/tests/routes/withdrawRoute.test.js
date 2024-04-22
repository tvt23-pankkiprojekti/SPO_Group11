const {API} = require('../../src/config.js');
const jwt = require('jsonwebtoken');
const Response = require('../../src/responses.js');
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluMSIsImlhdCI6MTcxMzczNTI2OX0.wXnXwGhwDDLSC8_KivnImFd0CFs4anm75xzOkLYrigg';

// An account is needed for a withdrawal but the account
// numbers are auto-generated and change between tests
// so we need to get one at the start of the test every time
async function getAccount() {
    const account = await (
        await fetch(`${API.url()}/admin/api/account/1`, {headers: {
            "Authorization": adminToken
        }})
    ).json();

    // And let's pretend the server signed it for us
    const signedAccount = jwt.sign(
        { accountNumber: account.accountNumber },
        API.SECRET,
        { expiresIn: 60 }
    );

    return signedAccount;
}

test('make a withdrawal', async () => {
    const signedAccount = await getAccount();

    const res = await fetch(`${API.url()}/api/withdraw`, {
        method: 'POST',
        body: JSON.stringify({amount: 10}),
        headers: {
            'Content-Type': 'application/json',
            authorization: signedAccount
        }
    });

    expect(res.status).toEqual(200);

    expect(await res.json()).toEqual({
        code: Response.OK,
        amount: 10.00
    });
});

test('withdrawal with no amount', async () => {
    const signedAccount = await getAccount();

    const res = await fetch(`${API.url()}/api/withdraw`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
            'Content-Type': 'application/json',
            authorization: signedAccount
        }
    });

    expect(res.status).toEqual(400);
});

test('withdraw with no body', async () => {
    const signedAccount = await getAccount();

    const res = await fetch(`${API.url()}/api/withdraw`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: signedAccount
        }
    });

    expect(res.status).toEqual(400);
});

test('withdrawal with bad token', async () => {
    const res = await fetch(`${API.url()}/api/withdraw`, {
        method: 'POST',
        body: JSON.stringify({amount: 10}),
        headers: {
            'Content-Type': 'application/json',
            authorization: 'bad token'
        }
    });

    expect(res.status).toEqual(403);
});

test('try to withdraw too much money', async () => {
    const signedAccount = await getAccount();

    const res = await fetch(`${API.url()}/api/withdraw`, {
        method: 'POST',
        body: JSON.stringify({amount: 9001}),
        headers: {
            'Content-Type': 'application/json',
            authorization: signedAccount
        }
    });

    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual({code: Response.INSUFFICIENT_FUNDS});
});

test('withdrawal with incorrect type for amount', async () => {
    const signedAccount = await getAccount();

    const res = await fetch(`${API.url()}/api/withdraw`, {
        method: 'POST',
        body: JSON.stringify({amount: ':)'}),
        headers: {
            'Content-Type': 'application/json',
            authorization: signedAccount
        }
    });

    expect(res.status).toEqual(400);
});


