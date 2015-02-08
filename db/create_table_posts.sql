USE lomus;
CREATE TABLE `posts` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `author_id` INT UNSIGNED NOT NULL,
  `content` varchar(255) collate utf8_bin,
  PRIMARY KEY (`id`)
);
