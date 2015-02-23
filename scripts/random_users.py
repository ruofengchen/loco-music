import random
import string

f2 = open("random_names.txt", "r")
f3 = open("insert_random_users.sql", "w")
f3.write('USE lomus;\n')
names = []
for l in f2.readlines():
	names += [l.strip()]

world_center_x = 37.5735
world_center_y = -122.0469
radius = 3
district_res = 0.1

num_users = 10000
for i in range(num_users):
	user_name = ''.join(random.choice(string.ascii_lowercase) for _ in range(10))
	name = random.choice(names)
	email = (''.join(random.choice(string.ascii_lowercase) for _ in range(3))) + '@' + \
	''.join(random.choice(string.ascii_lowercase) for _ in range(4)) + '.com'
	passwd_salt = 'passwd_test'
	mtype = random.choice(['guitar', 'piano', 'vocal'])
	lat = world_center_x + random.random() * 2 * radius - radius
	log = world_center_y + random.random() * 2 * radius - radius
	district_x = int(lat / district_res)
	district_y = int(log / district_res)
	sql = 'INSERT INTO users (user_name, email, name, passwd_salt, type, lat, log, district_x, district_y) VALUES ("%s", "%s", "%s", "%s", "%s", %f, %f, %d, %d);\n' % (user_name, email, name, passwd_salt, mtype, lat, log, district_x, district_y)
	f3.write(sql)
f3.write("COMMIT;\n")

f2.close()
f3.close()