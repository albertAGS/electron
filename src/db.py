import sys
import sqlite3

for line in sys.stdin:
    print(line)
    

conn = sqlite3.connect('./example.db')
c = conn.cursor()
for row in c.execute('SELECT * FROM Airbus_Transactions ORDER BY price'):
    print (row)