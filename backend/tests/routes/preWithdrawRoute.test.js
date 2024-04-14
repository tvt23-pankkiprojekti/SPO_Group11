const config = require('../../src/config.js');
const jwt = require('jsonwebtoken');

const secretKey = 'secret';

const token = jwt.sign({ accountNumber: 10 },secretKey);

test('pre-withdraw all correct', async () => {
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