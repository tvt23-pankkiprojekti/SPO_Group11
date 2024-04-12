const config = require('../../src/config.js');

const token = 'testi_token';

test('check valid token', async () => {
    const result = await fetch(
        `http://localhost:${config.PORT}/api/preWithdraw/example`,
        {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
              } 
            });

      console.log(await result.json());
});