import pandas as pd
import os
import warnings
warnings.filterwarnings('ignore')

HOMEDIR = os.path.expanduser("~")
cf = pd.read_csv(HOMEDIR + '/simspace/src/assets/csv/cluster_fills.csv')
mf = pd.read_csv(HOMEDIR + '/simspace/src/assets/csv/master.csv')

import json

def row2jso(mf,cf,i):
    row = mf.loc[i]
    jso = {}
    jso['fullname'] = row.fullname
    jso['leaf'] = row.leaf
    jso['edition'] = str(int(row.edition))
    jso['title'] = row.title
    jso['year'] = row.year
    jso['support'] = row.support
    jso['dims'] = row.dims
    jso['area'] = row.area
    jso['thickness'] = row.thickness
    jso['texturepath'] = row.texturepath
    jso['printpath'] = row.printpath

    for col in cf.columns:
        jso[col] = int(cf[col].loc[i])

    print(jso)

    return jso

jsonArray = [row2jso(mf,cf,i) for i in mf.index]

JSONDIR = HOMEDIR + '/simspace/src/assets/json/'
with open(JSONDIR+'__clusterfills.json','w') as outfile:
    json.dump(jsonArray,outfile)
