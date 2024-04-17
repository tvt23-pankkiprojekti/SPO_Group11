const { API } = require("../../src/config.js");
const jwt = require('jsonwebtoken');

// rauaap's code is needed here
// An account is needed for a withdrawal but the account
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

test('pre-withdraw all correct', async () => {
    const signedAccount = await getAccount();
    const res = await fetch(`${API.url()}/api/prewithdraw`,{
        headers: {
            authorization: signedAccount,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    expect(res.status).toEqual(200);
});


test('pre-withdraw invalid token', async () => {
    const res = await fetch(`${API.url()}/api/prewithdraw`,{
        headers: {
            authorization: 'blaablaa',
            "Content-Type": "application/json",
            "Accept": "application/json"
        } 
    });

    expect(res.status).toEqual(403);
});

test('pre-withdraw token missing', async () => {
    const res = await fetch(`${API.url()}/api/prewithdraw`,{
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        } 
    });
    expect(res.status).toEqual(400);
});