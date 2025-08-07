Create TABLE IF NOT Exists users(
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username varchar(100) NOT NULL Unique,
    password varchar(255) NOT NULL,
    email varchar(100) NOT null unique,
    z_code_id BIGINT UNSIGNED not null unique,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at DATETIME
);

CREATE TABLE IF NOT Exists classes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    class_code VARCHAR(10) NOT NULL UNIQUE,
    class_description TEXT,
    class_manager_zcode_id BIGINT NOT NULL,
    class_manager_name VARCHAR(255),
    created_at DATETIME,
    is_delete BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME
);

CREATE TABLE IF NOT Exists lectures (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lecture_name VARCHAR(255) NOT NULL,
    lecture_description TEXT,
    class_id BIGINT UNSIGNED NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    lecturer_zcode_id BIGINT,
    lecturer_name VARCHAR(255),

    created_at DATETIME,
    is_delete BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,

    CONSTRAINT fk_lecture_class FOREIGN KEY (class_id)
         REFERENCES classes(id)
         ON DELETE CASCADE
);

CREATE TABLE IF NOT Exists class_participants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT UNSIGNED NOT NULL,
    user_zcode_id BIGINT NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    class_name VARCHAR(255),
    username VARCHAR(255),

    created_at DATETIME,
    is_delete BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,

    CONSTRAINT uniq_class_participant UNIQUE (class_id, user_zcode_id),

    CONSTRAINT fk_participant_class FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT Exists roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,

    created_at DATETIME,
    is_delete BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME
);

CREATE TABLE IF NOT Exists auth_point (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_method VARCHAR(10) NOT NULL,
    request_path VARCHAR(255) NOT NULL,
    permission_code VARCHAR(255) NOT NULL,

    created_at DATETIME,
    is_delete BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME
);
CREATE TABLE IF NOT Exists user_role (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    assigned_by BIGINT UNSIGNED,

    created_at DATETIME,
    is_delete BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,

    CONSTRAINT uniq_user_role UNIQUE (user_id, role_id),

    CONSTRAINT fk_userrole_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_userrole_role FOREIGN KEY (role_id)
       REFERENCES roles(id)
       ON DELETE CASCADE

);

CREATE TABLE IF NOT Exists role_auth_point (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    auth_point_id BIGINT UNSIGNED NOT NULL,

    created_at DATETIME,
    is_delete BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,

    CONSTRAINT fk_roleauth_role FOREIGN KEY (role_id)
     REFERENCES roles(id)
     ON DELETE CASCADE,
    CONSTRAINT fk_roleauth_auth FOREIGN KEY (auth_point_id)
     REFERENCES auth_point(id)
     ON DELETE CASCADE,

    CONSTRAINT uniq_role_auth UNIQUE (role_id, auth_point_id)
);

