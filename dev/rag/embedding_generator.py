# -*- coding: utf-8 -*-
"""
Created on Fri Jun  7 17:37:06 2024

@author: goura
"""

from gensim.models import Word2Vec
import os
import numpy as np
#%%
# Load preprocessed text from the text file
text_file_path = 'data/preprocessed_text.txt'
with open(text_file_path, 'r', encoding='utf-8') as file:
    preprocessed_texts = file.readlines()
#%%
# Convert text to list of sentences
sentences = [text.split() for text in preprocessed_texts]

# Train Word2Vec model
word2vec_model = Word2Vec(sentences, min_count=1)

# Get embeddings for each word
word_embeddings = word2vec_model.wv

#%% Store the embeddings
embedding_file_path = 'data/word_embeddings.csv'
np.savetxt(embedding_file_path, word_embeddings.vectors, delimiter=',')
