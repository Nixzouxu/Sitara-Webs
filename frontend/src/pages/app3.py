from flask import Flask, request, jsonify
from flask_cors import CORS 
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app) # Mengaktifkan CORS untuk semua rute

# --- LANGKAH 1: Memuat Model ---
try:
    model = joblib.load("pcos_model.joblib")
    print("Model PCOS berhasil dimuat!")
except FileNotFoundError:
    print("Error: File 'pcos_model.joblib' tidak ditemukan. Pastikan file ada di direktori yang sama.")
    model = None
except Exception as e:
    print(f"Error saat memuat model: {e}")
    model = None

@app.route("/", methods=["GET"])
def home():
    return "Server Flask berjalan!"

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"message": "Model not loaded. Server error."}), 500

    print("LOG: Menerima permintaan prediksi...")
    data = request.get_json()
    print(f"LOG: Menerima data JSON: {data}")

    # --- LANGKAH 2: Validasi dan Pemrosesan Data Input ---
    required_keys = [
        "Age (in Years)", "Weight (in Kg)", "Height (in Cm / Feet)",
        "Can you tell us your blood group ?",
        "After how many months do you get your periods? (select 1- if every month/regular)",
        "Have you gained weight recently?",
        "Do you have excessive body/facial hair growth ?",
        "Are you noticing skin darkening recently?",
        "Do have hair loss/hair thinning/baldness ?",
        "Do you have pimples/acne on your face/jawline ?",
        "Do you eat fast food regularly ?",
        "Do you exercise on a regular basis ?",
        "Do you experience mood swings ?",
        "Are your periods regular ?",
        "How long does your period last ? (in Days) example- 1,2,3,4....."
    ]
    
    if not all(key in data for key in required_keys):
        missing_keys = [key for key in required_keys if key not in data]
        print(f"LOG: Data input tidak lengkap. Kunci yang hilang: {missing_keys}")
        return jsonify({
            "message": f"Data input tidak lengkap. Kunci yang hilang: {', '.join(missing_keys)}"
        }), 400

    print("LOG: Validasi data berhasil, mengonversi ke DataFrame...")
    try:
        # Perbaikan: Bangun dictionary baru dengan kunci yang diurutkan
        # Ini memastikan urutan dan nama kolom selalu cocok dengan yang diharapkan model
        processed_data = {key: data[key] for key in required_keys}
        
        # Konversi data input yang sudah diproses ke DataFrame
        input_df = pd.DataFrame([processed_data])
        print(f"LOG: DataFrame dibuat: {input_df}")

        if "Have you been diagnosed with PCOS/PCOD?" in input_df.columns:
            input_df = input_df.drop("Have you been diagnosed with PCOS/PCOD?", axis=1)

        # --- LANGKAH 4: Prediksi dan Perhitungan Probabilitas ---
        print("LOG: Melakukan prediksi model...")
        probabilities = model.predict_proba(input_df)[0]
        prob_positive_class = probabilities[1] 
        pred_class = model.predict(input_df)[0]
        print("LOG: Prediksi berhasil.")

        # Menentukan level risiko berdasarkan probabilitas
        risk_level = "Rendah" 
        if prob_positive_class > 0.65:
            risk_level = "Tinggi"
        elif prob_positive_class > 0.4:
            risk_level = "Sedang"

        # --- LANGKAH 5: Mengembalikan Hasil ---
        print("LOG: Mengembalikan hasil ke Node.js...")
        return jsonify({
            "prediction": int(pred_class), 
            "risk_level": risk_level,
            "percentage": round(prob_positive_class * 100, 2)
        })
    except ValueError as ve:
        print(f"ERROR: Tipe data tidak valid: {str(ve)}")
        return jsonify({"message": f"Tipe data tidak valid: {str(ve)}"}), 400
    except Exception as e:
        print(f"ERROR: Terjadi kesalahan saat memproses data: {str(e)}")
        return jsonify({"message": f"Terjadi kesalahan saat memproses data: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000)
