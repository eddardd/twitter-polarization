import twint
import pandas as pd
from tqdm import tqdm

df = pd.read_csv('./users.csv')
seed_users = df['Usuário'].values
orientation = df['Orientação Política'].values


for username in tqdm(seed_users):
    searchParameters = twint.Config() 
    searchParameters.Username = username
    searchParameters.Retweets = True
    searchParameters.Since = "2020-08-1"
    searchParameters.Store_csv = True
    searchParameters.Output = "./data/{}.csv".format(username)
    searchParameters.Hide_output = True
     
    twint.run.Search(searchParameters) 