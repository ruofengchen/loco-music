USE lomus;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `email` varchar(64) collate utf8_bin NOT NULL UNIQUE,
  `user_name` varchar(255) collate utf8_bin NOT NULL UNIQUE,
  `passwd_salt` varchar(40) collate utf8_bin NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT '0000-00-00',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
  );