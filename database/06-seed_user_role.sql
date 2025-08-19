INSERT IGNORE INTO user_role (user_id, role_id, created_at, is_delete)
SELECT u.id, r.id, NOW(), 0
FROM users u, roles r
WHERE u.username = 'admin'
  AND r.role_name = 'Administrator';