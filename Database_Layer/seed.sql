-- ==========================================
-- SmartStore Initial Seed Data
-- ==========================================

-- 1. Seed Admin and Test Users
-- Note: Passwords should be bcrypt hashes in production!
INSERT INTO users (username, email, password, role) VALUES 
('admin_user', 'admin@smartstore.com', '$2b$10$abcdefghijklmnopqrstuv', 'ADMIN'),
('vipul_1005', 'vipul@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'USER'),
('john_doe', 'john@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'USER');

-- 2. Seed Product Inventory
INSERT INTO products (name, description, price, category, stock_quantity) VALUES 
('MacBook Pro M3', '14-inch, 18GB RAM, 512GB SSD', 1999.00, 'Electronics', 15),
('Sony WH-1000XM5', 'Noise Cancelling Headphones', 348.00, 'Audio', 40),
('Logitech MX Master 3S', 'Wireless Performance Mouse', 99.00, 'Accessories', 100),
('Keychron K2', 'Mechanical Wireless Keyboard', 89.00, 'Accessories', 50),
('Samsung 34" Odyssey G5', 'Ultra-Wide Gaming Monitor', 450.00, 'Electronics', 20),
('Apple iPad Air', '10.9-inch, 64GB', 599.00, 'Electronics', 35);

-- 3. Seed Sample Orders
INSERT INTO orders (user_id, total_amount, status) VALUES 
(2, 447.00, 'DELIVERED'),
(3, 1999.00, 'SHIPPED'),
(2, 89.00, 'PENDING');

-- 4. Seed Order Items
-- Mapping products to the orders above
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES 
(1, 2, 1, 348.00),
(1, 3, 1, 99.00),
(2, 1, 1, 1999.00),
(3, 4, 1, 89.00);