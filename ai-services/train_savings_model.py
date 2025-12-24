import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
import joblib

# Load dataset
df = pd.read_csv("personal_finance_tracker_dataset.csv")

# Select features
X = df[
    [
        "monthly_income",
        "monthly_expense_total",
        "discretionary_spending",
        "essential_spending",
        "credit_score",
        "debt_to_income_ratio"
    ]
]

y = df["actual_savings"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
print("✅ Model MAE:", mae)

# Save model
joblib.dump(model, "savings_model.pkl")
print("🎉 Model saved as savings_model.pkl")
