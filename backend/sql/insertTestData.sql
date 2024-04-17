INSERT INTO `Administrator` (`login`, `passwordHash`) VALUES
('admin1', 'hash1'),
('admin2', 'hash2'),
('admin3', 'hash3');

INSERT INTO `User` (`firstName`, `lastName`)
VALUES
('John', 'Doe'),
('Alice', 'Smith'),
('Michael', 'Johnson'),
('Emily', 'Brown'),
('Daniel', 'Williams'),
('Sarah', 'Taylor'),
('Christopher', 'Anderson'),
('Emma', 'Martinez'),
('David', 'Garcia'),
('Olivia', 'Miller');

INSERT INTO `Account` (`User_id`, `type`, `balance`, `limit`)
VALUES
(1, 'debit', 100.00, 0.00),
(2, 'debit', 1500.00, 0.00),
(3, 'debit', 2000.00, 0.00),
(4, 'credit', 1200.50, -1000.00),
(5, 'credit', 1800.00, -2000.00),
(6, 'debit', 10.00, 0.00),
(7, 'debit', 1700.00, 0.00),
(8, 'credit', 0.00, -1200.00),
(9, 'debit', 20.90, 0.00),
(10, 'debit', 1900.00, 0.00);

INSERT INTO `Friend` (`User_id`, `Account_id`)
VALUES
(1, 2),
(7, 10);

INSERT INTO `Card` (`User_id`, `pinHash`, `number`) VALUES
(1, 'hash1', '1234567890123456'),
(2, 'hash2', '2345678901234567'),
(3, 'hash3', '3456789012345678'),
(4, 'hash4', '4567890123456789'),
(5, 'hash5', '5678901234567890'),
(6, 'hash6', '6789012345678901'),
(7, 'hash7', '7890123456789012'),
(8, 'hash8', '8901234567890123'),
(9, 'hash9', '9012345678901234'),
(10, 'hash10', '0123456789012345');

INSERT INTO `Card_Account` (`Card_id`, `Account_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

INSERT INTO `Transaction` (`Account_id`, `dateTime`, `balanceChange`, `transactionType`) VALUES
(1, NOW(), -50.00, 'withdraw'),
(2, NOW(), 100.00, 'deposit'),
(3, NOW(), -20.00, 'withdraw'),
(4, NOW(), 200.00, 'deposit'),
(5, NOW(), -10.00, 'withdraw'),
(6, NOW(), 50.00, 'deposit'),
(7, NOW(), -30.00, 'withdraw'),
(8, NOW(), 300.00, 'deposit'),
(9, NOW(), -40.00, 'withdraw'),
(10, NOW(), 400.00, 'deposit'),
(10, NOW(), 10.00, 'deposit'), 
(10, NOW(), -7.50, 'withdraw'), 
(10, NOW(), 20.00, 'deposit'), 
(10, NOW(), -3.25, 'withdraw');
