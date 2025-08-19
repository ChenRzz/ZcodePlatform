INSERT INTO users
(id, username, password, email, created_at, is_delete, deleted_at, z_code_id)
VALUES
    (1, 'admin', '$2a$10$p8zJmqLZ7kIrlah8K6/deusSpj71ZLJNDuO25qTgiOpNq1oma/FPa',
     'admin@admin.com', '2025-08-05 13:33:13', 0, NULL, 25080500005)
    ON DUPLICATE KEY UPDATE
                         username=VALUES(username),
                         password=VALUES(password),
                         email=VALUES(email),
                         is_delete=VALUES(is_delete),
                         deleted_at=VALUES(deleted_at),
                         z_code_id=VALUES(z_code_id);

