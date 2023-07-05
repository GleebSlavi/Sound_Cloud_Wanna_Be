CREATE TABLE user(
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    create_date DATE NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE song(
    id VARCHAR(255) PRIMARY KEY,
    user_id  VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    release_year INTEGER NOT NULL,
    genre VARCHAR(255) NOT NULL,
    upload_date DATE NOT NULL,
    image_url VARCHAR(255),
    cloud_url VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE playlist(
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    create_date DATE NOT NULL,
    type VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE user_playlist(
    user_id VARCHAR(255),
    playlist_id VARCHAR(255),
    PRIMARY KEY (user_id, playlist_id),
    FOREIGN KEY (user_id) REFERENCES user(id) DELETE ON CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlist(id) DELETE ON CASCADE
);

CREATE TABLE playlist_song(
  playlist_id VARCHAR(255),
  song_id VARCHAR(255),
  PRIMARY KEY (playlist_id, song_id),
  FOREIGN KEY (playlist_id) REFERENCES playlist(id) DELETE ON CASCADE,
  FOREIGN KEY (song_id) REFERENCES song(id) DELETE ON CASCADE
);