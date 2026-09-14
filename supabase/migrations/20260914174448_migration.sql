CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'wakasiswak', 'staff', 'guru')),
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES inventory_categories(id),
  quantity INTEGER DEFAULT 0,
  condition TEXT NOT NULL CHECK (condition IN ('Baik', 'Rusak Ringan', 'Rusak Berat')),
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS borrow_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  borrowed_by UUID NOT NULL REFERENCES users(id),
  class TEXT,
  department TEXT,
  borrow_date TIMESTAMP DEFAULT NOW(),
  return_date TIMESTAMP,
  status TEXT NOT NULL CHECK (status IN ('Dipinjam', 'Dikembalikan')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS receipt_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT UNIQUE NOT NULL,
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  submitted_by UUID NOT NULL REFERENCES users(id),
  submitter_name TEXT NOT NULL,
  submitter_class TEXT,
  submitter_department TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (email, name, phone, role, department) VALUES
  ('admin@smk-maarif.id', 'Admin', '0811158980', 'admin', 'Administrasi'),
  ('super@smk-maarif.id', 'Super Admin', '0811158980', 'super_admin', 'Administrasi'),
  ('wakasiswak@smk-maarif.id', 'Wakil Siswa dan Kesiswaan 4', '081234567890', 'wakasiswak', 'Kesiswaan'),
  ('staff1@smk-maarif.id', 'Staf Inventaris 1', '081234567891', 'staff', 'Inventaris'),
  ('guru1@smk-maarif.id', 'Guru Biologi', '081234567892', 'guru', 'Biologi')
  ON CONFLICT (email) DO NOTHING;

INSERT INTO inventory_categories (name, description) VALUES
  ('Alat Lab', 'Peralatan laboratorium'),
  ('Peralatan', 'Peralatan umum sekolah'),
  ('Ruangan', 'Ruang kelas dan ruangan'),
  ('Buku', 'Buku referensi dan pelajaran'),
  ('Elektronik', 'Perangkat elektronik')
  ON CONFLICT (name) DO NOTHING;