import urllib

f = open('music_list.txt', 'r')
f_out = open('insert_songs.sql', 'w')
f_out.write('USE lomus;\n')
for l in f.readlines():
    tokens = l.strip().split(' - ')
    artist = urllib.quote(tokens[0])
    title = urllib.quote(tokens[1])
    f_out.write('INSERT INTO songs (title, artist) VALUES ("%s", "%s");\n' % (title, artist))

f_out.write('COMMIT;\n')
f_out.close()
f.close()
