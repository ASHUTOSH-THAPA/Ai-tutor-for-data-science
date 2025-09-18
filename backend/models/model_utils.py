import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler, LabelEncoder,OneHotEncoder,OrdinalEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score,precision_score,recall_score,f1_score,
r2_score,mean_squared_error,confusion_matrix,RocCurveDisplay)
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import cross_val_score
import joblib
import os
import logging
logger=logging.getLogger(__name__)
from sklearn.ensemble import GradientBoostingClassifier

ALGOS={
    'RandomForestClassifier': RandomForestClassifier,
    'LogisticRegression': LogisticRegression,
    'DecisionTreeClassifier': DecisionTreeClassifier,
    'SVC': SVC,
    'KMeans': KMeans,
    'PCA': PCA,
    'GradientBoostingClassifier': GradientBoostingClassifier,
    'LinearRegression': LinearRegression
}
def clean_data(df:pd.DataFrame):
  df=df.drop_duplicates()
  df=df.loc[:,df.isnull().mean()<0.5]
  for col in df.columns:
    if df[col].dtype in ['int64','float']:
      df[col]=df[col].fillna(df[col].median())
    else:
      df[col]=df[col].fillna(df[col].mode()[0])
  return df

def split_features(df:pd.DataFrame,target:str|None):
  if target:
    X=df.drop(target,axis=1)
    y=df[target]
    if y.dtype=='O':
      y=LabelEncoder().fit_transform(y.astype(str))
  else:
    y,X=None,df.copy()
  numerical_column=df.select_dtypes(include=['int64','float']).columns
  categorical_column=df.select_dtypes(include=['object','category']).columns
  return X,y,numerical_column,categorical_column

def build_preprocessor(numerical_column,categorical_column,use_ordinal=False):
  cat_encoder=OrdinalEncoder(handle_unknown="use_encoded_value",unknown_value=-1) if use_ordinal else OneHotEncoder(handle_unknown="ignore")
  preprocessor=ColumnTransformer(
      transformers=[
          ("num",Pipeline([
              ("imputer",SimpleImputer(strategy="median")),
              ("scaler",StandardScaler())
          ]),numerical_column),
          ("cat",Pipeline([
              ("imputer",SimpleImputer(strategy="most_frequent")),
              ("encoder",cat_encoder)
          ]),categorical_column)
      ]
  )
  return preprocessor

def train(task:str,algorithm:str,df=pd.DataFrame,target:str | None=None,test_size=0.2,random_state=42,cv=5,params=None,figures_dir="backend/storage/figures"):
  df=clean_data(df)
  params=params or {}
  if algorithm not in ALGOS:
    raise ValueError(f'Algorithm {algorithm} not found in dictionary')
  if task in ['classification','regression'] and not target:
    raise ValueError('target column is required in classification/regression task')
  X,y,numerical_column,categorical_column=split_features(df,target)
  preprocessor=build_preprocessor(numerical_column,categorical_column)

  Model=ALGOS[algorithm]
  model=Model(**params)
  pipeline=Pipeline(
      steps=[
          ('preprocessor',preprocessor),
          ('model',model)
      ]
  )

  if task =="clustering":
    for c in X.select_dtypes(include=['object','category']).columns:
      X[c]=LabelEncoder().fit_transform(X[c])
    model.fit(X)
    inertia=getattr(model,"inertia_",None)
    return{
        'metrics':{"inertia":float(inertia) if inertia is not None else None},
        'artifact_path':None,
        'roc_path':None,
        'confusion_matrix':None,
        'feature_importance':None }
  else:
    X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=test_size,random_state=random_state)
    if algorithm =='SVC':
      pipeline.named_steps['model'].set_params(probability=True)
    pipeline.fit(X_train,y_train)
    y_pred=pipeline.predict(X_test)
    metrics={
            "accuracy": float(accuracy_score(y_test, y_pred)) if task=="classification" else None,
            "precision": float(precision_score(y_test, y_pred, average="weighted", zero_division=0)) if task=="classification" else None,
            "recall": float(recall_score(y_test, y_pred, average="weighted", zero_division=0)) if task=="classification" else None,
            "f1": float(f1_score(y_test, y_pred, average="weighted")) if task=="classification" else None,
            "rmse": float(mean_squared_error(y_test, y_pred, squared=False)) if task=="regression" else None,
            "r2": float(r2_score(y_test, y_pred)) if task=="regression" else None,
    }

    cm=confusion_matrix(y_test,y_pred).tolist() if task == 'classification' else None

    roc_path=None

    if task == "classification":
      try:
        RocCurveDisplay.from_estimator(pipeline,X_test,y_test)
        roc_path=os.path.join(figures_dir,f"roc_{algorithm}.png")
        plt.savefig(roc_path,bbox_inches="tight")
        plt.close()
      except Exception as e:
        logger.warning(f'ROC curve could not be generated: {e}')

    try:
      cv_score=cross_val_score(pipeline,X,y,cv=cv)
      metrics["cv_mean"]=float(cv_score.mean())
      metrics["cv_std"]=float(cv_score.std())
    except Exception as e:
      logger.warning(f'Cross validation failed: {e}')

    feature_importances=None  

    try:
      model_in_pipeline=pipeline.named_steps['model']
      feature_names=pipeline.named_steps['preprocessor'].get_feature_names_out()
      if hasattr(model_in_pipeline,'feature_imprtances_'):
        feature_importances=dict(zip(feature_names,model_in_pipeline.feature_importances_))
      elif hasattr(model_in_pipeline,'coef_'):
        coefs=model_in_pipeline.coef_ 
        if  coefs.ndim > 1:
          coefs=np.mean(np.abs(coefs),axis=0)
        feature_importances=dict(zip(feature_names,coefs))  
    except Exception as e:
      logger.warning(f'feature importance extraction failed: {e}')
 
    artifact_name=f"{algorithm}.pkl"
    artifact_path=os.path.join("backend/storage/artifacts",artifact_name)
    joblib.dump(pipeline,artifact_path)

    return{   
        "artifact_path":artifact_path,
        "metrics":metrics,
        "confusion_matrix":cm,
        "roc_path":roc_path,
        "feature_importances":feature_importances
     }













