import pandas as pd
import numpy as np
import os
import warnings
warnings.filterwarnings('ignore')

HOMEDIR = os.path.expanduser("~")
cf = pd.read_csv(HOMEDIR + '/simspace/src/assets/csv/cluster.csv')

'''
Create reassigned labels for all possible cluster model transitions. We do this
because we want the transitions between clustering assignments --- say, from
sp k-means with 4 clusters to sp k-means with 5 clusters --- to change as few
of the cluster *labels* as possible. Of course, the *groupings* are determined by
the clustering algorithms. But cluster '4' in one model might be a very different
group of datapoints in another model, despite the models' having very similar
(or even identical) groupings. This is an attempt to make the visual transitions
in the app as easy to follow as possible.
'''
from itertools import permutations

# this function takes actual columns (i.e., pd.Series)
def chgct(col1,col2):
    return np.sum(col1==col2)

# this function takes a dataframe and 2 column names (as strings)
def find_closest(cf,col1name,col2name):
    ordered_labels = tuple(cf[col2name].unique())
    all_permutations = list(permutations(ordered_labels))

    # remove the original sequence of labels
    all_permutations.remove(ordered_labels)

    # for each new possible ordering, create a replacement dict,
    # replace and measure change
    maxsim = 0
    bestcol = cf[col2name] # the original column itself
    for permutation_i in all_permutations:
        replacement_dict = dict(zip(ordered_labels,permutation_i))
        tmp = pd.Series([replacement_dict[item] for item in cf[col2name]])
        sim = chgct(cf[col1name],tmp)
        if sim > maxsim:
            maxsim = sim
            bestcol = tmp

    return bestcol

allcols = cf.columns
allpairings = []
for col in allcols:
    opposition_list = [item for item in allcols if item!=col]
    for item in opposition_list:
        allpairings.append((col,item))

tf = pd.DataFrame()
# This will take a while (maybe 15 minutes or so)
n = len(allpairings)
for i, pairing in enumerate(allpairings):
    col1name = pairing[0]
    col2name = pairing[1]

    tf[col1name+'__'+col2name] = find_closest(cf,col1name,col2name)
    print(i+1,'of',n,pairing)

tf.to_csv(HOMEDIR + '/simspace/src/assets/csv/cluster_fills.csv', index=False)
