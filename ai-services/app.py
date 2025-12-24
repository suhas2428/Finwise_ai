from flask import Flask, request, jsonify
import joblib
import datetime

app = Flask(__name__)

# Load trained model (3 features)
model = joblib.load("model/savings_model.pkl")

@app.route("/predict-savings", methods=["POST"])
def predict_savings():
    data = request.json

    salary = float(data["salary"])
    total_spent = float(data["totalExpenses"])

    today = datetime.date.today()
    day = today.day

    # ⚠️ EXACT FEATURE COUNT = 3
    X = [[day, total_spent, salary]]

    predicted_monthly_spend = model.predict(X)[0]
    predicted_savings = salary - predicted_monthly_spend

    return jsonify({
        "predictedMonthlyExpense": round(predicted_monthly_spend, 2),
        "predictedSavings": round(predicted_savings, 2)
    })

if __name__ == "__main__":
    app.run(port=8001)
