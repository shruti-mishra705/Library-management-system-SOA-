from flask import Flask, request, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from datetime import datetime
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger_fine.yaml'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Library SOA Fine Service API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

@app.route('/')
def home():
    return "Fine Service is running"

@app.route('/calculate', methods=['POST'])
def calculate_fine():
    data = request.json
    issue_date_str = data.get("issue_date")
    return_date_str = data.get("return_date")

    if not issue_date_str or not return_date_str:
        return jsonify({"message": "Missing issue_date or return_date"}), 400

    try:
        issue_date = datetime.strptime(issue_date_str, '%Y-%m-%d')
        return_date = datetime.strptime(return_date_str, '%Y-%m-%d')
        days = (return_date - issue_date).days
        fine = max(0, (days - 14) * 2)
        return jsonify({"fine": fine}), 200
    except Exception as e:
        return jsonify({"message": f"Error calculating fine: {str(e)}"}), 500

@app.route('/calculate/<int:user_id>', methods=['GET'])
def calculate_fine_by_user(user_id):
    BORROWER_SERVICE_URL = "http://localhost:5002"
    try:
        response = requests.get(f"{BORROWER_SERVICE_URL}/records/{user_id}")
        response.raise_for_status()
        records = response.json()

        total_fine = 0
        fine_details = []

        for record in records:
            issue_date = datetime.strptime(record['issue_date'], '%Y-%m-%d')
            return_date_str = record.get('return_date')
            if return_date_str:
                return_date = datetime.strptime(return_date_str, '%Y-%m-%d')
            else:
                return_date = datetime.now()

            days = (return_date - issue_date).days
            fine = max(0, (days - 14) * 2)

            fine_details.append({
                "book_id": record['book_id'],
                "issue_date": record['issue_date'],
                "return_date": return_date.strftime('%Y-%m-%d'),
                "fine": fine
            })

            total_fine += fine

        return jsonify({
            "user_id": user_id,
            "total_fine": total_fine,
            "details": fine_details
        })

    except requests.exceptions.RequestException as e:
        return {"message": f"Failed to fetch data from Borrower Service: {str(e)}"}, 500

if __name__ == '__main__':
    print("Swagger UI available at: http://localhost:5003/swagger")
    app.run(host='0.0.0.0', port=5003)
