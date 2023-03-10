
import pandas as pd
import sys

for input in sys.stdin:
    line = input
path = input.split(',')

# Read the CSV file into a pandas DataFrame
df = pd.read_csv(path[0]) if ('.csv' in path[0]) else pd.read_excel(path[0])

# Create an empty dictionary to store the data
data_dict = {}

# Iterate through each row of the DataFrame and add it to the dictionary
for index, row in df.iterrows():
    fragment = row['fragment']
    name = row['name']
    price = row['price']
    data_dict[fragment] = {'fragment': fragment, 'name': name, 'price': price}

# Read the CSV file into a pandas DataFrame
secondFile = path[1].replace('.csv\n','.csv')
dataFrame = pd.read_csv(secondFile) if ('.csv' in secondFile) else pd.read_excel(secondFile)
for index, row in dataFrame.iterrows():
    fragment = int(str(row['fragment1']) + str(row['fragment2']) + str(row['fragment3']))
    # Merge the data
    data_dict[fragment]['name1'] = row['name1']
    data_dict[fragment]['price1'] = row['price1']

# Add all the data as a tuple in a array that will be stored in the DB
dataToStore = []
for data in data_dict.values():
    dataToStore.append((data['fragment'],data['name'],data['name1'],data['price'],data['price1'],))


import sqlite3

# Create DB
open("example.db", 'w+')

# Connect to the DB
conn = sqlite3.connect('example.db')
c = conn.cursor()

# Drop table to reset the values
c.execute('DROP TABLE IF EXISTS Airbus_Transactions')

# Create table
c.execute('''CREATE TABLE Airbus_Transactions
             (fragment text, name text, name1 text, price real, price1 real)''')

# Insert the rows of data
c.executemany('INSERT INTO Airbus_Transactions VALUES (?,?,?,?,?)', dataToStore)

# Save (commit) the changes
conn.commit()

# Print rows
for row in c.execute('SELECT * FROM Airbus_Transactions ORDER BY price'):
    print (row)
conn.close()
