
import pandas as pd
import sys
import json

# name of the columns for each file, the first one is the
columns_KPI_ACME = ("DAN Reference", "PO Number", "Delivery Date", "PO Value (€)", "SoW Work Unit Ref.", "Competence Family", "Program",
                    "Supplier Project Leader Name", "Airbus Project Focal Point Name", "Airbus Project Focal point Siglum", "Airbus Buyer Name", "Entity", "Sites", "Country")
columns_project_order = ('Year of PO receipt', 'Year of PO end', 'Date of PO issuance', 'Project/Katalog',
                         'Customer', 'Order Number', 'Beginn', 'End', 'Company', 'volume in total', 'EWS', 'Customer Contact Person')
columns_project_order = ('Year of PO receipt', 'Year of PO end',
                         'Date of PO issuance', 'Project/Katalog')

# how many header columns are
header_KPI_ACME = [0, 1, 2, 3]
header_project_order = [0, 1, 2, 3, 4, 5, 6]

# read the JSON string from stdin
input_str = sys.stdin.read()

# parse the JSON string into a Python object
files = json.loads(input_str)

for file in files:
    # create function to get the headers
    print(file['name'], file['sheet'], file['path'])
    # if the file contains Project use: columns_project_order and header_project_order
    if ('Project' in file['path']):
        df = pd.read_excel(
            file['path'], sheet_name=file['sheet'], header=header_project_order)
        column_names = list(df.columns)
        filtered_headers = [header for header in column_names
                            if any(column in header for column in columns_project_order)]
        specific_cols = df.loc[:, filtered_headers]
        specific_cols_list = specific_cols.values.tolist()
        for index, row in df.iterrows():
            print('index', index)
            print('row', row)

    # otherwise the file contains KPI use: columns_KPI_ACME and header_KPI_ACME
    else:
        df = pd.read_excel(
            file['path'], sheet_name=file['sheet'], header=header_KPI_ACME)
        column_names = list(df.columns)
        filtered_headers = [header for header in column_names
                            if any(column in header for column in columns_KPI_ACME)]
        # it is kind of filtrated, it need to take a look of the seperated headers such as:Delivery Date
        # print(filtered_headers)
        specific_cols = df.loc[:, filtered_headers]
        specific_cols_list = specific_cols.values.tolist()


# Clean the path
# secondFile = path[1].replace('\n','')

# # Read the CSV file into a pandas DataFrame
# # The one that is called KPI_ACME the sheet that has to be reed is called 'Performance Control'
# # The one that is called Project Order Status the sheet that has to be reed is called 'RN Liste mit Check'
# if ('KPI_ACME' in path[0]):
#     performance = pd.read_excel(path[0], sheet_name='Performance Control')
#     liste = pd.read_excel(secondFile, sheet_name='RN Liste mit Check')
# else:
#     performance = pd.read_excel(path[0], sheet_name='Performance Control')
#     liste = pd.read_excel(secondFile, sheet_name='RN Liste mit Check')

# # Create an empty dictionary to store the data
# data_dict = {}

# # Iterate through each row of the DataFrame and add it to the dictionary
# for index, row in performance.iterrows():
#     print(row[index])
#     # fragment = row['fragment']
#     # name = row['name']
#     # price = row['price']
#     # data_dict[fragment] = {'fragment': fragment, 'name': name, 'price': price}

# # Read the CSV file into a pandas DataFrame
# for index, row in liste.iterrows():
#     print(row)

#     # fragment = int(str(row['fragment1']) + str(row['fragment2']) + str(row['fragment3']))
#     # # Merge the data
#     # data_dict[fragment]['name1'] = row['name1']
#     # data_dict[fragment]['price1'] = row['price1']

# # Add all the data as a tuple in a array that will be stored in the DB
# # dataToStore = []
# # for data in data_dict.values():
# #     dataToStore.append((data['fragment'],data['name'],data['name1'],data['price'],data['price1'],))
# #     print(data)


# # import sqlite3

# # # Create DB
# # open("example.db", 'w+')

# # # Connect to the DB
# # conn = sqlite3.connect('example.db')
# # c = conn.cursor()

# # # Drop table to reset the values
# # c.execute('DROP TABLE IF EXISTS Airbus_Transactions')

# # # Create table
# # c.execute('''CREATE TABLE Airbus_Transactions
# #              (fragment text, name text, name1 text, price real, price1 real)''')

# # # Insert the rows of data
# # c.executemany('INSERT INTO Airbus_Transactions VALUES (?,?,?,?,?)', dataToStore)

# # # Save (commit) the changes
# # conn.commit()

# # # Print rows
# # for row in c.execute('SELECT * FROM Airbus_Transactions ORDER BY price'):
# #     print (dataToStore)
# # conn.close()


# Reichstag, Checkpoint charlie, Unter den linden, Aleksanderplatz, Tempelhofer Feld, Mauerpark, Raw Markt, Holzmarkt25, Urban nation, Tiergarten, Teufelsberg, East side gallery, Warsauerstrasse, Konigs Galerie, Hakescher Markt, Gendarmenmarkt, Potsdamer Platz, Charlottenburg Palace, Potsdam, Pfaumnsinsel
