import pandas as pd
from typing import Tuple
def load_data(path:str)->pd.DataFrame:
    try:
        df=pd.read_csv(path)
        if df.empty:
            raise ValueError("provided csv file is empty")
        if len(df.columns)<2:
            raise ValueError("provided csv file has less than 2 columns")
        return df
    except Exception as e:
        raise ValueError(f"Error loading data: {e}")
def basic_summary(df:pd.DataFrame):
    describe=df.describe(include='all',datetime_is_numeric=True).transpose().fillna(0)
    info=df.info()
    missing=df.isna().sum().to_dict()
    dtypes=df.dtypes.astype(str).to_dict()
    return {
        'describe':describe,
        'info':info,
        'missing':missing,
        'dtypes':dtypes
    }