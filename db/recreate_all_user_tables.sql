USE lomus;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `email` varchar(64) NOT NULL UNIQUE,
  `user_name` varchar(255) NOT NULL UNIQUE,
  `name` varchar(255) collate utf8_general_ci,
  `passwd_salt` varchar(40) NOT NULL,
  `lat` float(24) NOT NULL,
  `type` enum('guitar', 'piano', 'vocal'),
  `log` float(24) NOT NULL,
  `district_x` INT,
  `district_y` INT,
  `recent_commit_id` INT UNSIGNED,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
CREATE INDEX district_x_index ON `users` (district_x);
CREATE INDEX district_y_index ON `users` (district_y);

DROP TABLE IF EXISTS `rates`;
CREATE TABLE `rates` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `author_id` INT UNSIGNED NOT NULL,
  `session_id` INT UNSIGNED NOT NULL,
  `r0` float(24),
  `r1` float(24),
  `r2` float(24),
  `r3` float(24),
  `r4` float(24),
  `content` varchar(2048) collate utf8_general_ci,
  `sound_url` varchar(2048),
  `video_url` varchar(2048),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `songs`;
CREATE TABLE `songs` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `title` varchar(2048) collate utf8_general_ci,
  `artist` varchar(2048) collate utf8_general_ci,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
CREATE INDEX title_index ON `songs` (title);

DROP TABLE IF EXISTS `commits`;
CREATE TABLE `commits` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `author_id` INT UNSIGNED NOT NULL,
  `song_id` INT UNSIGNED NOT NULL,
  `current_version` INT UNSIGNED,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
CREATE INDEX author_id_index ON `commits` (author_id);

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `commit_id` INT UNSIGNED NOT NULL,
  `content` varchar(2048) collate utf8_general_ci,
  `sound_url` varchar(2048),
  `video_url` varchar(2048),
  `version` INT UNSIGNED NOT NULL,
  `r0` float(24),
  `r1` float(24),
  `r2` float(24),
  `r3` float(24),
  `r4` float(24),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
CREATE INDEX commit_id_index ON `sessions` (commit_id);

DROP TABLE IF EXISTS `reviewers`;
CREATE TABLE `reviewers` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `session_id` INT UNSIGNED NOT NULL,
  `reviewer_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
);
CREATE INDEX session_id_index ON `reviewers` (session_id);

