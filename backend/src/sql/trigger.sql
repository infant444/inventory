-- Active: 1750250082768@@127.0.0.1@5432@inventory

-- User Update Trigger Event
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();