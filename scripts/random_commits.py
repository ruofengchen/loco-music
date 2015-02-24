import random
import MySQLdb
import urllib

f = open("insert_random_commits.sql", "w")
f.write('USE lomus;\n')

db = MySQLdb.connect(host='localhost', user='root', passwd='corvus', db='lomus')
cursor = db.cursor()
cursor.execute('SELECT id FROM users')
res = cursor.fetchall()
uids = []
for rec in res:
    uids += [rec[0]]

cursor.execute('SELECT id FROM songs')
res = cursor.fetchall()
songids = []
for rec in res:
    songids += [rec[0]]

# commit id may not start from 0
for uid in uids:
    if random.random() > 0.99:
        continue
    for i in range(random.choice(range(5))):
        songid = random.choice(songids)
        num_version = random.choice(range(10))
        if num_version == 0:
            f.write('INSERT INTO commits (author_id, song_id) VALUES (%u, %u);\n' % (uid, songid))
        else:
            f.write('INSERT INTO commits (author_id, song_id, current_version) VALUES (%u, %u, %u);\n' % (uid, songid, num_version - 1))

f.write('COMMIT;\n')
f.close()
