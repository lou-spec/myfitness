-- Schema SQL para PostgreSQL (Referência Futura)
-- Este é um schema de referência caso queiras migrar de MongoDB para PostgreSQL

-- Tabela de Trainers (Users)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  photo_url TEXT,
  city VARCHAR(100),
  specialties TEXT[], -- Array de especialidades
  bio TEXT,
  price_per_session DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'EUR',
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  trainer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  notes TEXT,
  medical_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Disponibilidade
CREATE TABLE availability_slots (
  id SERIAL PRIMARY KEY,
  trainer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  weekday INTEGER CHECK (weekday >= 0 AND weekday <= 6), -- 0=Domingo, 6=Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  recurring BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agendamentos
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  trainer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'done', 'no-show')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pagamentos
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
  trainer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  stripe_charge_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pacotes
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  trainer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  sessions_count INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_clients_trainer ON clients(trainer_id);
CREATE INDEX idx_availability_trainer ON availability_slots(trainer_id);
CREATE INDEX idx_appointments_trainer ON appointments(trainer_id);
CREATE INDEX idx_appointments_datetime ON appointments(start_datetime);
CREATE INDEX idx_payments_trainer ON payments(trainer_id);
CREATE INDEX idx_packages_trainer ON packages(trainer_id);

-- Views úteis

-- View: Próximos agendamentos
CREATE VIEW upcoming_appointments AS
SELECT 
  a.id,
  a.trainer_id,
  u.name as trainer_name,
  a.client_name,
  a.start_datetime,
  a.end_datetime,
  a.status
FROM appointments a
JOIN users u ON a.trainer_id = u.id
WHERE a.start_datetime >= NOW()
  AND a.status = 'booked'
ORDER BY a.start_datetime;

-- View: Estatísticas por trainer
CREATE VIEW trainer_stats AS
SELECT 
  u.id as trainer_id,
  u.name as trainer_name,
  COUNT(DISTINCT c.id) as total_clients,
  COUNT(DISTINCT CASE WHEN a.start_datetime >= DATE_TRUNC('month', CURRENT_DATE) THEN a.id END) as appointments_this_month,
  COUNT(DISTINCT CASE WHEN a.status = 'done' THEN a.id END) as completed_appointments
FROM users u
LEFT JOIN clients c ON u.id = c.trainer_id
LEFT JOIN appointments a ON u.id = a.trainer_id
GROUP BY u.id, u.name;

-- Função: Verificar conflito de agendamento
CREATE OR REPLACE FUNCTION check_appointment_conflict(
  p_trainer_id INTEGER,
  p_start_datetime TIMESTAMP,
  p_end_datetime TIMESTAMP,
  p_exclude_id INTEGER DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO conflict_count
  FROM appointments
  WHERE trainer_id = p_trainer_id
    AND status != 'cancelled'
    AND (id != p_exclude_id OR p_exclude_id IS NULL)
    AND (
      (start_datetime < p_end_datetime AND end_datetime > p_start_datetime)
    );
  
  RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Atualizar slug automaticamente
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_slug_trigger
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION generate_slug();
