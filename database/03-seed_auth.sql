
INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'GET', '/auth/role/all', 'ROLE_VIEW', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'ROLE_VIEW');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/role/create', 'ROLE_CREATE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'ROLE_CREATE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/role/update', 'ROLE_UPDATE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'ROLE_UPDATE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/role/delete', 'ROLE_DELETE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'ROLE_DELETE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/role/byID', 'ROLE_VIEW_BY_ID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'ROLE_VIEW_BY_ID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/role/auth_point/add', 'ROLE_ADD_AUTH_POINT', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'ROLE_ADD_AUTH_POINT');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/role/auth_point/delete', 'ROLE_REMOVE_AUTH_POINT', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'ROLE_REMOVE_AUTH_POINT');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/role/auth_point/all', 'ROLE_VIEW_AUTH_POINTS', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'ROLE_VIEW_AUTH_POINTS');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'GET', '/auth/role/byID', 'ROLE_VIEW_BY_ID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'ROLE_VIEW_BY_ID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/authPoint/create', 'AUTH_POINT_CREATE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'AUTH_POINT_CREATE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/authPoint/update', 'AUTH_POINT_UPDATE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'AUTH_POINT_UPDATE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/authPoint/delete', 'AUTH_POINT_DELETE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'AUTH_POINT_DELETE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/authPoint/byID', 'AUTH_POINT_VIEW_BY_ID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'AUTH_POINT_VIEW_BY_ID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'GET', '/auth/authPoint/all', 'AUTH_POINT_VIEW_ALL', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'AUTH_POINT_VIEW_ALL');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/user_role/add', 'USER_ROLE_ADD', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'USER_ROLE_ADD');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/user_role/delete', 'USER_ROLE_DELETE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'USER_ROLE_DELETE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/user_role/byID', 'USER_ROLE_VIEW_BY_ID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'USER_ROLE_VIEW_BY_ID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/user_role/byUID', 'USER_ROLE_VIEW_BY_UID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'USER_ROLE_VIEW_BY_UID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/authPoint/byPermissionCode', 'AUTH_POINT_VIEW_BY_PERMISSION', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'AUTH_POINT_VIEW_BY_PERMISSION');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/auth/user_role/by_userID', 'USER_ROLE_VIEW_BY_OTHERS_ID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'USER_ROLE_VIEW_BY_OTHERS_ID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'GET', '/class/all', 'GET_CLASS_ALL', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'GET_CLASS_ALL');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/create', 'POST_CLASS_CREATE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_CREATE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/delete', 'POST_CLASS_DELETE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_DELETE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/update', 'POST_CLASS_UPDATE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_UPDATE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/byID', 'POST_CLASS_BYID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_BYID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'GET', '/class/byCode', 'GET_CLASS_BYCODE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'GET_CLASS_BYCODE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'GET', '/class/byManagerZcode', 'GET_CLASS_BYMANAGERZCODE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'GET_CLASS_BYMANAGERZCODE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/lecture/create', 'POST_CLASS_LECTURE_CREATE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_LECTURE_CREATE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/lecture/delete', 'POST_CLASS_LECTURE_DELETE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_LECTURE_DELETE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/lecture/update', 'POST_CLASS_LECTURE_UPDATE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_LECTURE_UPDATE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/lecture/byLID', 'POST_CLASS_LECTURE_BYLID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_LECTURE_BYLID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/lecture/byCID', 'POST_CLASS_LECTURE_BYCID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_LECTURE_BYCID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/participant/add', 'POST_CLASS_PARTICIPANT_ADD', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_PARTICIPANT_ADD');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/participant/delete', 'POST_CLASS_PARTICIPANT_DELETE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_PARTICIPANT_DELETE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/participant/update', 'POST_CLASS_PARTICIPANT_UPDATE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_PARTICIPANT_UPDATE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'GET', '/class/participant/byZcode', 'GET_CLASS_PARTICIPANT_BYZCODE', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'GET_CLASS_PARTICIPANT_BYZCODE');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'POST', '/class/participant/byCID', 'POST_CLASS_PARTICIPANT_BYCID', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'POST_CLASS_PARTICIPANT_BYCID');

INSERT INTO auth_point (request_method, request_path, permission_code, created_at, is_delete)
SELECT 'GET', '/class/participant/my_classes', 'GET_CLASS_PARTICIPANT_MYCLASSES', NOW(), 0
    WHERE NOT EXISTS (SELECT 1 FROM auth_point WHERE permission_code = 'GET_CLASS_PARTICIPANT_MYCLASSES');
