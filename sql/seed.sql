INSERT INTO users (name, email, password_hash)
VALUES
('Alice', 'alice@example.com', '$argon2id$v=19$m=65536,t=3,p=4$fakehash1'),
('Bob', 'bob@example.com', '$argon2id$v=19$m=65536,t=3,p=4$fakehash2');

INSERT INTO fiat_balances (user_id, currency, balance)
VALUES
(1, 'THB', 100000),
(2, 'THB', 50000),
(1, 'USD', 5000),
(2, 'USD', 2500);

INSERT INTO wallets (user_id, currency, balance)
VALUES
(1, 'BTC', 0.5),
(2, 'BTC', 1.0);

INSERT INTO crypto_transactions (from_wallet_id, to_wallet_id, currency, amount)
VALUES
(2, 1, 'BTC', 0.1);

INSERT INTO orders (user_id, type, currency, price_per_unit, amount)
VALUES
(1, 'buy', 'BTC', 950000, 0.1),
(2, 'sell', 'BTC', 940000, 0.1);
