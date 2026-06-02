import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# =========================
# LOAD DATASET
# =========================

data = pd.read_csv("../dataset/student_data.csv")

print(data.head())

# =========================
# FEATURES AND TARGET
# =========================

X = data[['StudyHours', 'Attendance', 'PreviousMarks', 'AssignmentScore']]
y = data['FinalScore']

# =========================
# TRAIN TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# =========================
# LINEAR REGRESSION
# =========================

lr_model = LinearRegression()
lr_model.fit(X_train, y_train)
lr_predictions = lr_model.predict(X_test)

print("\nLinear Regression Results")
print("MAE:", mean_absolute_error(y_test, lr_predictions))
print("R2 Score:", r2_score(y_test, lr_predictions))

# =========================
# RANDOM FOREST
# =========================

rf_model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)
rf_model.fit(X_train, y_train)
rf_predictions = rf_model.predict(X_test)

print("\nRandom Forest Results")
print("MAE:", mean_absolute_error(y_test, rf_predictions))
print("R2 Score:", r2_score(y_test, rf_predictions))

# =========================
# SAVE BEST MODEL
# =========================

joblib.dump(rf_model, "../models/student_model.pkl")

print("\nModel Saved Successfully")
