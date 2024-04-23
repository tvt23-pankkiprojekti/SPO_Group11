-- insert minimal test data

INSERT INTO `Administrator` (`login`, `passwordHash`)
VALUES ("admin", "$2a$12$AmmT1LTY861Xp072GaIwKuAaDhAne503qOGHK.l1S3nXJJpdArwwC"); -- admin

INSERT INTO `User` (`firstName`, `lastName`)
VALUES ("John", "Doe");

INSERT INTO `Account` (`User_id`, `type`, `balance`, `limit`, `accountNumber`)
VALUE (1, "debit", 1000, 0, "b36f7b42-8aca-448d-af61-4710dc93fa9f"),
      (1, "credit", 0, -1000, "784f1226-a789-454c-8e35-caee09cc1397");

INSERT INTO `Card` (`User_id`, `pinHash`, `number`, `frozen`)
VALUES (1, "$2a$12$7Hsh1oZ41u3Qq9aCk2BcjOisx9Twed6WQJ67OJqE14MOwRByyZ5/i", "1000200030004000", 0), -- 1111, (debit)
       (1, "$2a$12$KLqB/.kcL.nYceRRjQbcj.jN3wH1JTTi2zeNYfojBSmO3ZWyO8EGO", "1000200030004001", 0), -- 2222, (credit)
       (1, "$2a$12$oHZfn.9.p/EfDU.URqAwL.y//4.Y9gkhUSsgJzO6BAbdLDe6J972m", "1000200030004002", 0), -- 3333, (debit/credit)
       (1, "$2a$12$ZXKPlxOKAvZzW/FIQZq3aevzPul7xMM7rghkwNjeaAufMMlRcRdz2", "1000200030004003", 0), -- 4444, (no account)
       (1, "$2a$12$RXtA.pvbvW/6zvSRX7Vg4eTfQrolGYYoV9KCwFsyPsr8LSbLd0zdq", "1000200030004004", 1); -- 5555, (card frozen)

INSERT INTO `Card_Account` (`Card_id`, `Account_id`)
VALUES (1, 1),
       (2, 2),
       (3, 1),
       (3, 2),
       (5, 1);

INSERT INTO `Transaction` (`Account_id`, `dateTime`, `balanceChange`, `transactionType`)
VALUES (1, NOW()-0,  -50.00, 'withdraw'),
       (1, NOW()-1,  100.00, 'deposit'),
       (1, NOW()-2,  -20.00, 'withdraw'),
       (1, NOW()-3,  200.00, 'deposit'),
       (1, NOW()-4,  -10.00, 'withdraw'),
       (1, NOW()-5,  50.00,  'deposit'),
       (1, NOW()-6,  -30.00, 'withdraw'),
       (1, NOW()-7,  300.00, 'deposit'),
       (1, NOW()-8,  -40.00, 'withdraw'),
       (1, NOW()-9,  400.00, 'deposit'),
       (1, NOW()-10, 10.00,  'deposit'),
       (1, NOW()-11, -7.50,  'withdraw'),
       (1, NOW()-12, 20.00,  'deposit');
