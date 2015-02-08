USE lomus;
CREATE TABLE `zipcodes` (
  `id` INT UNSIGNED NOT NULL auto_increment,
  `zipcode` INT UNSIGNED NOT NULL UNIQUE,
  `log` float(24),
  `lat` float(24),
  PRIMARY KEY (`id`)
);
