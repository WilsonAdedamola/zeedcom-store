 -- SUPABASE SCHEMA & SEED DATA

-- 1. STORES TABLE
CREATE TABLE IF NOT EXISTS public.stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT NOT NULL,
    manager TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STAFF & ADMIN ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.staff_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
    store_id TEXT REFERENCES public.stores(id) ON DELETE SET NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    sales_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MULTI-STORE INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    threshold INTEGER NOT NULL DEFAULT 5,
    track_imei BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SALES & CREDIT LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.sales (
    id TEXT PRIMARY KEY,
    receipt_no TEXT NOT NULL UNIQUE,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    staff_id TEXT,
    staff_name TEXT NOT NULL,
    customer_name TEXT NOT NULL DEFAULT 'Walk-in Customer',
    customer_phone TEXT NOT NULL DEFAULT 'N/A',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'Transfer', 'POS', 'Credit')),
    payment_ref TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    timestamp_label TEXT NOT NULL,
    is_credit BOOLEAN NOT NULL DEFAULT false,
    credit_status TEXT NOT NULL CHECK (credit_status IN ('PAID', 'UNPAID')) DEFAULT 'PAID',
    credit_note TEXT DEFAULT '',
    repaid_at TEXT,
    repaid_by TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATOMIC POS CHECKOUT FUNCTION (Deducts Stock & Logs Sale Safely)
CREATE OR REPLACE FUNCTION public.record_zeedcom_sale(
    p_sale_id TEXT,
    p_receipt_no TEXT,
    p_store_id TEXT,
    p_staff_id TEXT,
    p_staff_name TEXT,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_payment_method TEXT,
    p_payment_ref TEXT,
    p_total_amount NUMERIC,
    p_timestamp_label TEXT,
    p_is_credit BOOLEAN,
    p_credit_status TEXT,
    p_credit_note TEXT,
    p_items JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item JSONB;
    v_inv_id TEXT;
    v_qty INTEGER;
    v_current_qty INTEGER;
    v_prod_name TEXT;
BEGIN
    -- 1. Verify and deduct stock for each item in cart
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_inv_id := v_item->>'id';
        v_qty := (v_item->>'qty')::INTEGER;

        SELECT quantity, name INTO v_current_qty, v_prod_name
        FROM public.inventory
        WHERE id = v_inv_id
        FOR UPDATE;

        IF v_current_qty IS NULL OR v_current_qty < v_qty THEN
            RAISE EXCEPTION 'Insufficient stock for % (Available: %)', COALESCE(v_prod_name, 'Item'), COALESCE(v_current_qty, 0);
        END IF;

        UPDATE public.inventory
        SET quantity = quantity - v_qty,
            updated_at = NOW()
        WHERE id = v_inv_id;
    END LOOP;

    -- 2. Insert immutable sale / credit record
    INSERT INTO public.sales (
        id, receipt_no, store_id, staff_id, staff_name,
        customer_name, customer_phone, payment_method, payment_ref,
        total_amount, timestamp_label, is_credit, credit_status, credit_note, items
    ) VALUES (
        p_sale_id, p_receipt_no, p_store_id, p_staff_id, p_staff_name,
        p_customer_name, p_customer_phone, p_payment_method, p_payment_ref,
        p_total_amount, p_timestamp_label, p_is_credit, p_credit_status, p_credit_note, p_items
    );

    -- 3. Increment staff sales counter
    IF p_staff_id IS NOT NULL THEN
        UPDATE public.staff_users
        SET sales_count = sales_count + 1
        WHERE id = p_staff_id;
    END IF;
END;
$$;

-- 7. ROW LEVEL SECURITY (RLS) & REALTIME SUBSCRIPTIONS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Allow app access via anon key
CREATE POLICY "Allow public app access to stores" ON public.stores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public app access to categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public app access to staff_users" ON public.staff_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public app access to inventory" ON public.inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public app access to sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime on core tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.stores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;

-- 8. SEED INITIAL ZEEDCOM STORES DATA
INSERT INTO public.stores (id, name, location, phone, manager) VALUES
('store-1', 'Store 1: Challenge HQ', 'Shop 14, Tech Plaza, Challenge', '08031112222', 'Tunde Bakare'),
('store-2', 'Store 2: Mokola Express', 'Suite 6, GSM Village, Mokola', '08053334444', 'Sadiq Yusuf'),
('store-3', 'Store 3: Ring Road Hub', 'Block B, Electronics Mall', '08075556666', 'Chinedu Okafor')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (name) VALUES
('Phone Screens (LCD/OLED)'),
('Batteries & Power'),
('Charging Flex & ICs'),
('Smartphones & Gadgets'),
('Accessories & Chargers')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.staff_users (id, name, email, password, role, store_id, active, sales_count) VALUES
('admin-1', 'Engr. Azeez', 'admin@zeedcom.ng', 'password123', 'admin', NULL, true, 0),
('stf-1', 'Tunde Bakare', 'tunde@zeedcom.ng', 'staff123', 'staff', 'store-1', true, 14),
('stf-2', 'Sadiq Yusuf', 'sadiq@zeedcom.ng', 'staff123', 'staff', 'store-2', true, 9),
('stf-3', 'Blessing Adeyemi', 'blessing@zeedcom.ng', 'staff123', 'staff', 'store-1', true, 11),
('stf-4', 'Chinedu Okafor', 'chinedu@zeedcom.ng', 'staff123', 'staff', 'store-3', false, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inventory (id, sku, name, category, store_id, cost_price, selling_price, quantity, threshold, track_imei) VALUES
('inv-1', 'SCR-IP13PM-OLED', 'iPhone 13 Pro Max Original OLED Screen', 'Phone Screens (LCD/OLED)', 'store-1', 68000, 85000, 2, 5, true),
('inv-2', 'SCR-SAM-A54', 'Samsung Galaxy A54 Super AMOLED Service Pack', 'Phone Screens (LCD/OLED)', 'store-1', 42000, 55000, 12, 4, false),
('inv-3', 'IC-SAM-A54-SUB', 'Samsung A54 Original Charging Port Sub-Board', 'Charging Flex & ICs', 'store-2', 4500, 9500, 1, 5, false),
('inv-4', 'BAT-INF-N30', 'Infinix Note 30 / Note 30 Pro Battery (BL-49NX)', 'Batteries & Power', 'store-2', 8500, 14500, 16, 5, false),
('inv-5', 'GAD-IP12-128', 'iPhone 12 128GB Factory Unlocked (UK Used)', 'Smartphones & Gadgets', 'store-1', 310000, 365000, 4, 2, true),
('inv-6', 'ACC-ORA-20K', 'Oraimo 20,000mAh Traveler Fast PowerBank', 'Accessories & Chargers', 'store-3', 13500, 19500, 3, 5, false),
('inv-7', 'ACC-20W-USB-C', 'Apple 20W USB-C Fast Power Adapter', 'Accessories & Chargers', 'store-1', 7500, 12500, 24, 6, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sales (
    id, receipt_no, store_id, staff_id, staff_name, customer_name, customer_phone,
    payment_method, payment_ref, total_amount, timestamp_label, is_credit, credit_status, credit_note, items
) VALUES
(
    'sale-101', 'RCP-20261104-8492', 'store-1', 'stf-1', 'Tunde Bakare', 'Mr. Adebayo', '08030001122',
    'Transfer', 'GTBank - Sess 99281', 97500, '04/11/2026, 14:22', false, 'PAID', '',
    '[{"id":"inv-1","name":"iPhone 13 Pro Max Original OLED Screen","qty":1,"price":85000,"imei":"SN-8829102"},{"id":"inv-7","name":"Apple 20W USB-C Fast Power Adapter","qty":1,"price":12500,"imei":""}]'::jsonb
),
(
    'sale-102', 'CRD-20261104-5510', 'store-1', 'stf-3', 'Blessing Adeyemi', 'Engr. Muyiwa (Partner Workshop)', '08062229988',
    'Credit', 'Promised Friday Evening', 67500, '04/11/2026, 11:30', true, 'UNPAID', 'Took screen & charger for client job',
    '[{"id":"inv-2","name":"Samsung Galaxy A54 Super AMOLED Service Pack","qty":1,"price":55000,"imei":"SN-A54-991"},{"id":"inv-7","name":"Apple 20W USB-C Fast Power Adapter","qty":1,"price":12500,"imei":""}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;