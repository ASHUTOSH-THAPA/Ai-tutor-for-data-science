import os, joblib, shap, pandas as pd
import matplotlib.pyplot as plt
from lime.lime_tabular import LimeTabularExplainer

plt.switch_backend("Agg")  # safe for servers with no display

def shap_global(model_path: str, df: pd.DataFrame, figures_dir: str, max_samples: int = 100) -> str:
    model = joblib.load(model_path)
    X = df.select_dtypes(exclude=["object", "category"]).copy()
    if X.empty:
        X = pd.get_dummies(df, drop_first=True)
    if len(X) > max_samples:
        X = X.sample(max_samples, random_state=42)
    explainer = shap.Explainer(model, X)
    shap_values = explainer(X)
    model_name = os.path.splitext(os.path.basename(model_path))[0]
    out = os.path.join(figures_dir, f"shap_importance_{model_name}.png")
    shap.plots.bar(shap_values, show=False)
    plt.savefig(out, bbox_inches="tight")
    plt.close()
    return out
def lime_local(model_path: str, df: pd.DataFrame, row_index: int):
    model = joblib.load(model_path)
    X = pd.get_dummies(df.dropna().reset_index(drop=True), drop_first=True)
    if X.empty:
        raise ValueError("No valid rows to explain after dropping NaNs.")
    if row_index < 0 or row_index >= len(X):
        raise IndexError(f"Row index {row_index} is out of range (0 to {len(X)-1}).")
    mode = "classification" if hasattr(model, "predict_proba") else "regression"
    explainer = LimeTabularExplainer(
        X.values,
        feature_names=X.columns.tolist(),
        discretize_continuous=True,
        mode=mode
    )
    predict_fn = model.predict_proba if hasattr(model, 'predict_proba') else model.predict
    exp = explainer.explain_instance(X.iloc[row_index].values, predict_fn)
    return [{"feature": f, "weight": float(w)} for f, w in exp.as_list()]
