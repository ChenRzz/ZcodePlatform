INSERT IGNORE INTO role_auth_point (role_id, auth_point_id, created_at, is_delete)
SELECT r.id, a.id, NOW(), 0
FROM roles r
         JOIN auth_point a
WHERE r.role_name = 'Administrator';
