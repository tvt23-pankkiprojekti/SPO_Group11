const { API } = require("../../src/config");

const token = 'testi'

test('pre-withdraw2 all correct', async () => {
    const result = await fetch(
        //`http://localhost:${config.PORT}/api/preWithdraw/example`,
        `${API.url()}/admin/api/prewithdraw/example`,
        {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ accountNumber: 10})
            });
      //console.log(await text.json());
      console.log(await result.json());
});
/*
test('pre-withdraw token missing', async () => {
  const result = await fetch(
      `http://localhost:${config.PORT}/api/preWithdraw/example`,
      {
          method: 'GET',
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            } 
          });
    console.log(await result.json());
});

test('pre-withdraw invalid token', async () => {
  const result = await fetch(
      `http://localhost:${config.PORT}/api/preWithdraw/example`,
      {
          method: 'GET',
          headers: {
              "Authorization": `Bearer oooo`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            } 
          });
    console.log(await result.json());
});
*/