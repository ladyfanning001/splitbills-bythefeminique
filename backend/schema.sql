-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    payer TEXT NOT NULL CHECK (payer IN ('Yasmin', 'Ladya')),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    paid BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on timestamp for faster ordering
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);

-- Create an index on paid status for filtering
CREATE INDEX IF NOT EXISTS idx_transactions_paid ON transactions(paid);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional - remove if you don't want sample data)
INSERT INTO transactions (payer, description, amount, paid, timestamp) VALUES
    ('Yasmin', 'Dinner at Italian Restaurant', 45.50, false, NOW() - INTERVAL '2 hours'),
    ('Ladya', 'Movie tickets', 24.00, true, NOW() - INTERVAL '1 day'),
    ('Yasmin', 'Grocery shopping', 67.89, false, NOW() - INTERVAL '3 days');
