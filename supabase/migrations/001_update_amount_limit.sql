-- Migration: Update amount column to support larger numbers
-- This allows amounts up to 9,999,999,999,999.99 (9+ trillion)

-- Drop the existing check constraint
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_amount_check;

-- Alter the column type to NUMERIC(15, 2)
ALTER TABLE transactions 
ALTER COLUMN amount TYPE NUMERIC(15, 2);

-- Re-add the check constraint
ALTER TABLE transactions 
ADD CONSTRAINT transactions_amount_check CHECK (amount > 0);
