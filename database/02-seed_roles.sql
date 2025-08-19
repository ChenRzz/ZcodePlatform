INSERT INTO roles (role_name, description, created_at, is_delete)
SELECT 'Administrator', 'System Administrator. Have the authority of managing roles, AuthPoint, role\'s authority, user\'s role.', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Administrator');

INSERT INTO roles (role_name, description, created_at, is_delete)
SELECT 'Teacher', 'Teacher of the Zcode Platform. Have the Authority to Create Class, Create Lecture', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Teacher');

INSERT INTO roles (role_name, description, created_at, is_delete)
SELECT 'Student', 'Student of Zcode Platform, could participate in the class and lecture.', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Student');
