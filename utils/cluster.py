import pandas as pd
import numpy as np
import os

HOMEDIR = os.path.expanduser("~")

'''
If you want to use ivpy's sklearn wrappers here,
clone https://github.com/damoncrockett/ivpy. I use a 'test' version on my home
machine most of the time, which is why I use the path below. In any case, until
ivpy is bundled into a pip-installable package, you can use it by adding the
directory to your system path.
'''

import sys
sys.path.append(HOMEDIR + '/ivpytest/src')
from ivpy.cluster import cluster

import warnings
warnings.filterwarnings('ignore')

sp = pd.read_csv(HOMEDIR + '/simspace/src/assets/csv/sp.csv')
pasfa = pd.read_csv(HOMEDIR + '/simspace/src/assets/csv/pasfa.csv')

# currently, there are 36 cluster models, but can be any number
models = ['sp','pasfa']
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
            cf[model+'_'+method+'_'+str(num)] = tmp

cf.to_csv(HOMEDIR + '/simspace/src/assets/csv/cluster.csv', index=False)
