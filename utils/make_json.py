import pandas as pd
import os
import json
import warnings
warnings.filterwarnings('ignore')

HOMEDIR = os.path.expanduser("~")

import sys
sys.path.append(HOMEDIR + '/ivpytest/src')
from ivpy.extract import norm
from ivpy.reduce import pca,tsne,umap

masterfile = sys.argv[1]
modelfile = sys.argv[2]
clusterfile = sys.argv[3]

modelbase = os.path.basename(modelfile)[:-4]

mf = pd.read_csv(masterfile)
X = pd.read_csv(modelfile)
cf = pd.read_csv(clusterfile)

print('Computing 2D PCA coordinates...', end=' ')
mf[['xp','yp']] = norm(pca(X,n_components=2))
print('[DONE]')
print('Computing 2D t-SNE embedding...', end=' ')
mf[['xt','yt']] = norm(tsne(X))
print('[DONE]')
print('Computing 2D UMAP embedding...', end=' ')
mf[['xu','yu']] = norm(umap(X))
print('[DONE]\n\n')

for col in cf.columns:
    mf[col] = cf[col]
print('Added cluster assignments from',clusterfile)

def row2jso(mf,xcol,ycol,i):
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
    jso['x'] = row[xcol]
    jso['y'] = row[ycol]

    for col in cf.columns:
        jso[col] = int(row[col])

    print(jso)

    return jso

print('Creating JSON arrays...')
pcaArray = [row2jso(mf,'xp','yp',i) for i in mf.index]
tsneArray = [row2jso(mf,'xt','yt',i) for i in mf.index]
umapArray = [row2jso(mf,'xu','yu',i) for i in mf.index]
print('Finished creating JSON arrays')

JSONDIR = HOMEDIR + '/simspace/src/assets/json/'

print('Saving JSON files...')
with open(JSONDIR+'_'+modelbase+'_pca.json','w') as outfile:
    json.dump(pcaArray,outfile)
    print('Saved',outfile)
with open(JSONDIR+'_'+modelbase+'_tsne.json','w') as outfile:
    json.dump(tsneArray,outfile)
    print('Saved',outfile)
with open(JSONDIR+'_'+modelbase+'_umap.json','w') as outfile:
    json.dump(umapArray,outfile)
    print('Saved',outfile)
