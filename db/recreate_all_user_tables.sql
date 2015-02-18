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
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
CREATE INDEX district_x_index ON `users` (district_x);
CREATE INDEX district_y_index ON `users` (district_y);

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `author_id` INT UNSIGNED NOT NULL,
  `post_id` INT UNSIGNED NOT NULL,
  `content` varchar(255) collate utf8_bin,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `author_id` INT UNSIGNED NOT NULL,
  `content` varchar(255) collate utf8_bin,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

