ALTER TABLE "Orders"
ADD COLUMN phonenumber VARCHAR(20) DEFAULT 'PENDING';

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'Orders';