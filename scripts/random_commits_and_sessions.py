import random
import MySQLdb
import urllib

s_nouns = ["A dude", "My mom", "The king", "Some guy", "A cat with rabies", "A sloth", "Your homie", "This cool guy my gardener met yesterday", "Superman"]
p_nouns = ["These dudes", "Both of my moms", "All the kings of the world", "Some guys", "All of a cattery's cats", "The multitude of sloths living under your bed", "Your homies", "Like, these, like, all these people", "Supermen"]
s_verbs = ["eats", "kicks", "gives", "treats", "meets with", "creates", "hacks", "configures", "spies on", "retards", "meows on", "flees from", "tries to automate", "explodes"]
infinitives = ["to make a pie.", "for no apparent reason.", "because the sky is green.", "for a disease.", "to be able to make toast explode.", "to know more about archeology."]

def random_sentence():
    return random.choice(s_nouns) +' '+ random.choice(s_verbs) +' '+ random.choice(s_nouns).lower() +' '+ random.choice(infinitives)

f = open("insert_random_commits_and_sessions.sql", "w")
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

cid = -1
for uid in uids:
    cid = cid + 1
    if random.random() > 0.99:
        continue
    songid = random.choice(songids)
    num_version = random.choice(range(10))
    if num_version == 0:
        f.write('INSERT INTO commits (author_id, song_id) VALUES (%u, %u);\n' % (uid, songid))
    else:
        f.write('INSERT INTO commits (author_id, song_id, current_version) VALUES (%u, %u, %u);\n' % (uid, songid, num_version - 1))
    f.write('UPDATE users SET recent_commit_id = %u WHERE id = %u;\n' % (cid, uid))
    for version in range(num_version):
        content = urllib.quote(random_sentence())
        if random.random() > 0.9:
            f.write('INSERT INTO sessions (commit_id, content, version) VALUES (%u, "%s", %u);\n' % (cid, content, version))
        else:
            r = 5 * [0]
            for i in range(len(r)):
                r[i] = random.random() * 5
            f.write('INSERT INTO sessions (commit_id, content, version, r0, r1, r2, r3, r4) VALUES (%u, "%s", %u, %f, %f, %f, %f, %f);\n' % (cid, content, version, r[0], r[1], r[2], r[3], r[4]))

f.write('COMMIT;\n')
f.close()
