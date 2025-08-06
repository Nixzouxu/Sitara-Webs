from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app) # Mengaktifkan CORS untuk semua rute

# Muat model Anda
# Pastikan 'model/endometriosis_model.joblib' ada di direktori yang benar
try:
    model = joblib.load("model/endometriosis_model.joblib")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None # Set model ke None jika gagal dimuat

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"message": "Model not loaded. Server error."}), 500

    data = request.get_json()

    # Pastikan semua kunci yang diharapkan ada dalam data
    required_keys = ["Age", "Menstrual_Irregularity", "Chronic_Pain_Level", 
                     "Hormone_Level_Abnormality", "Infertility", "BMI"]
    for key in required_keys:
        if key not in data:
            return jsonify({"message": f"Missing data for key: {key}"}), 400

    try:
        # Membuat DataFrame dari data yang diterima
        input_df = pd.DataFrame([{
            "Age": float(data["Age"]),
            "Menstrual_Irregularity": int(data["Menstrual_Irregularity"]),
            "Chronic_Pain_Level": int(data["Chronic_Pain_Level"]),
            # PERBAIKAN DI SINI: Mengubah 'Hormone_level_Abnormality' menjadi 'Hormone_Level_Abnormality'
            "Hormone_Level_Abnormality": int(data["Hormone_Level_Abnormality"]), 
            "Infertility": int(data["Infertility"]),
            "BMI": float(data["BMI"])
        }])

        # Mendapatkan probabilitas untuk kedua kelas (0 dan 1)
        probabilities = model.predict_proba(input_df)[0]
        
        # Probabilitas kelas positif (memiliki kista)
        # Asumsi: kelas 1 adalah "memiliki kista"
        prob_positive_class = probabilities[1] 
        
        # Prediksi kelas (0 atau 1)
        pred_class = model.predict(input_df)[0]

        risk_level = "Rendah"
        if prob_positive_class > 0.65: # Jika probabilitas memiliki kista tinggi
            risk_level = "Tinggi"
        elif prob_positive_class > 0.4: # Jika probabilitas memiliki kista sedang
            risk_level = "Sedang"
        # Jika di bawah 0.4, tetap "Rendah"

        return jsonify({
            "prediction": int(pred_class), # Tetap kembalikan prediksi kelas
            "risk_level": risk_level,
            "percentage": round(prob_positive_class * 100, 2) # Gunakan probabilitas kelas positif
        })
    except ValueError as ve:
        return jsonify({"message": f"Invalid data type for input: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"message": f"Error during prediction: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000) # Pastikan Flask berjalan di port 5000
