CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(10) NOT NULL CHECK (currency IN ('BTC', 'ETH', 'XRP', 'DOGE')),
  balance NUMERIC(18,8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crypto_transactions (
  id SERIAL PRIMARY KEY,
  from_wallet_id INTEGER REFERENCES wallets(id) ON DELETE SET NULL,
  to_wallet_id INTEGER REFERENCES wallets(id) ON DELETE SET NULL,
  currency VARCHAR(10) NOT NULL,
  amount NUMERIC(18,8) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')),
  currency VARCHAR(10) NOT NULL CHECK (currency IN ('BTC', 'ETH', 'XRP', 'DOGE')),
  price_per_unit NUMERIC(18,8) NOT NULL,
  amount NUMERIC(18,8) NOT NULL,
  status VARCHAR(10) DEFAULT 'open' CHECK (status IN ('open', 'matched', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_matches (
  id SERIAL PRIMARY KEY,
  buy_order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  sell_order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  matched_amount NUMERIC(18,8) NOT NULL,
  price_per_unit NUMERIC(18,8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fiat_balances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(10) NOT NULL CHECK (currency IN ('THB', 'USD')),
  balance NUMERIC(18,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, currency)
);

CREATE TABLE IF NOT EXISTS fiat_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('deposit', 'withdraw', 'transfer')),
  currency VARCHAR(10) NOT NULL CHECK (currency IN ('THB', 'USD')),
  amount NUMERIC(18,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);