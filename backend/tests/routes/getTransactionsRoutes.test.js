const {API} = require('../../src/config.js');
const jwt = require('jsonwebtoken');

// An account is needed for getting transactions but the account
// numbers are auto-generated and change between tests
// so we need to get one at the start of the test every time
async function getAccount() {
    const account = await (
        await fetch(`${API.url()}/admin/api/account/1`)
    ).json();

    // And let's pretend the server signed it for us
    const signedAccount = jwt.sign(
        { accountNumber: account.accountNumber },
        API.SECRET,
        { expiresIn: 60 }
    );

    return signedAccount;
}

test('get all transactions', async () => {
    const signedAccount = await getAccount();

    const res = await fetch(`${API.url()}/api/transactions`, {
        headers: {
            'Content-Type': 'application/json',
            authorization: signedAccount
        }
    });

    expect(res.status).toEqual(200);
});

