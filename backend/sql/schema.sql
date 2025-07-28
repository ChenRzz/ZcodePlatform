Create TABLE IF NOT Exists users(
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username varchar(100) NOT NULL Unique,
    password varchar(255) NOT NULL,
    email varchar(100) NOT null unique,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at DATETIME
);
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    UNIQUE KEY unique_user_role (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
create table if not exists auths (
    id bigint unsigned auto_increment primary key,
    auth_name varchar(255) unique not null
);

create table if not exists role_auths (
    role_id bigint unsigned not null,
    auth_id bigint unsigned not null,
    primary key (role_id, auth_id),
    foreign key (role_id) references roles(id) on delete cascade,
    foreign key (auth_id) references auths(id) on delete cascade
);
