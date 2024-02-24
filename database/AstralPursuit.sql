CREATE TABLE `user` (
  `user_id` varchar[16] PRIMARY KEY,
  `name` varchar[100],
  `username` varchar[128],
  `password` varchar[256],
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `highscore` (
  `highscore_id` varchar[16] PRIMARY KEY,
  `user_id` varchar(255),
  `score` varchar[10],
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `progressgame` (
  `proggressgame_id` varchar[16] PRIMARY KEY,
  `user_id` varchar(255),
  `savefile` varchar[256],
  `chapter` varchar(1),
);

CREATE TABLE `blacklist` (
  `id` bigint AUTO_INCREMENT,
  `token` varchar(512),
  primary key(id)
);

ALTER TABLE `highscore` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `progressgame` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
