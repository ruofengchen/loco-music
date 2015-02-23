import random

s_nouns = ["This is", "That's", "Yeah it's", "Hey man it's", "Fuckshit is"]
p_nouns = ["biggest", "amazing", "shitty", "shineass-like", "funny", "so tiny"]
s_verbs = ["rogerdick", "badass", "shit", "stuff", "music", "a-ha", "life", "guitar"]

f = open("insert_random_comments.sql", "w")
f.write('USE lomus;\n')

for post_id in range(4000):
	for i in range(random.choice(range(10))):
		uid = random.choice(range(50))
		content = random.choice(s_nouns) +' '+ random.choice(p_nouns) +' '+ random.choice(s_verbs).lower()
		f.write('INSERT INTO comments (post_id, author_id, content) VALUES (%u, %u, "%s");\n' % (post_id, uid, content))
f.write('COMMIT;\n')
f.close()