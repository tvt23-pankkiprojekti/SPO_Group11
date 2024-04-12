-- insert minimal test data

-- creates an admin

-- creates an user with 3 cards (debit, credit, and debit/credit),
-- and 2 accounts for the cards

-- creates a card without linking an account

INSERT INTO `Administrator` (`login`, `passwordHash`)
VALUES ("admin", "$2a$12$AmmT1LTY861Xp072GaIwKuAaDhAne503qOGHK.l1S3nXJJpdArwwC"); -- admin

INSERT INTO `User` (`firstName`, `lastName`)
VALUES ("John", "Doe");

INSERT INTO `Account` (`User_id`, `type`, `balance`, `limit`)
VALUE (1, "debit", 1000, 0),
      (1, "credit", 0, -1000);

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
