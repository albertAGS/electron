import pandas as pd
import sys
import json


message = sys.stdin.readline()
my_obj = json.loads(message)

for input in my_obj:
    xl = pd.ExcelFile(input['path'])
    names = [input['name'], *xl.sheet_names]
    print(names)

