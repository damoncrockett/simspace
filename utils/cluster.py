import pandas as pd
import numpy as np
import os

HOMEDIR = os.path.expanduser("~")

'''
If you want to use ivpy's sklearn wrappers here,
clone https://github.com/damoncrockett/ivpy. Until
ivpy is bundled into a pip-installable package, you can use it by adding the
directory to your system path.
'''

import sys
sys.path.append(HOMEDIR + '/ivpy/src')
from ivpy.cluster import cluster

import warnings
warnings.filterwarnings('ignore')

sp = pd.read_csv(HOMEDIR + '/simspace/src/assets/csv/sp.csv')
pasfa = pd.read_csv(HOMEDIR + '/simspace/src/assets/csv/pasfa.csv')
amrhwt = pd.read_csv(HOMEDIR + '/simspace/src/assets/csv/amrhwt.csv')
ctnn = pd.read_csv(HOMEDIR + '/simspace/src/assets/csv/ctnn.csv')

# currently, there are 54 cluster models, but can be any number
models = ['sp','pasfa','amrhwt','ctnn']
methods = ['kmeans','hierarchical','spectral']
nums = [2,3,4,5,6,7]

# run cluster algorithms (all from sklearn)
cf = pd.DataFrame()
for model in models:
    for method in methods:
        for num in nums:
            if model=='sp':
                tmp = cluster(sp,method=method,k=num)
            elif model=='pasfa':
                tmp = cluster(pasfa,method=method,k=num)
            elif model=='amrhwt':
                tmp = cluster(amrhwt,method=method,k=num)
            elif model=='ctnn':
                tmp = cluster(ctnn,method=method,k=num)
            cf[model+'_'+method+'_'+str(num)] = tmp

cf.to_csv(HOMEDIR + '/simspace/src/assets/csv/cluster.csv', index=False)
