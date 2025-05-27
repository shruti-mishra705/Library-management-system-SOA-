from flask import Flask, request, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
import requests
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger_borrower.yaml'

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Library SOA Borrower Service API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

borrowers = []
issued_books = []
history_books = []

# Use localhost for development, Docker service names for production
BOOK_SERVICE_URL = "http://localhost:5001/books"
FINE_SERVICE_URL = "http://localhost:5003/calculate"

@app.route('/')
def home():
    return "Borrower Service is running"

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(borrowers)

@app.route('/users', methods=['POST'])
def register_user():
    user = request.json
    if not user or 'id' not in user or 'name' not in user:
        return {"message": "Missing required fields: id, name"}, 400
    
    if any(u['id'] == user['id'] for u in borrowers):
        return {"message": "User with this ID already exists"}, 400
    
    borrowers.append(user)
    return jsonify(user), 201

@app.route('/issue', methods=['POST'])
def issue_book():
    data = request.json
    if not data or 'book_id' not in data or 'user_id' not in data:
        return {"message": "Missing required fields: book_id, user_id"}, 400
    
    book_id = data['book_id']
    user_id = data['user_id']
    issue_date = data.get('issue_date', datetime.now().strftime('%Y-%m-%d'))

    if not any(user['id'] == user_id for user in borrowers):
        return {"message": "User not registered"}, 400

    # Check if book is already issued to someone
    if any(book['book_id'] == book_id for book in issued_books):
        return {"message": "Book is already issued"}, 400

    try:
        response = requests.get(BOOK_SERVICE_URL)
        if response.status_code != 200:
            return {"message": "Book service unavailable"}, 503
        books = response.json()
        if not any(book['id'] == book_id for book in books):
            return {"message": "Book does not exist"}, 400
    except Exception as e:
        return {"message": f"Error checking book: {str(e)}"}, 500

    issued_books.append({
        'book_id': book_id,
        'user_id': user_id,
        'issue_date': issue_date
    })
    return {"message": "Book issued successfully", "issue_date": issue_date}, 200

@app.route('/return', methods=['POST'])
def return_book():
    data = request.json
    if not data or 'user_id' not in data or 'book_id' not in data:
        return {"message": "Missing required fields: user_id, book_id"}, 400
    
    user_id = data['user_id']
    book_id = data['book_id']
    return_date = data.get('return_date', datetime.now().strftime('%Y-%m-%d'))

    for book in issued_books:
        if book['user_id'] == user_id and book['book_id'] == book_id:
            issue_date = book['issue_date']
            issued_books.remove(book)

            history_books.append({
                'user_id': user_id,
                'book_id': book_id,
                'issue_date': issue_date,
                'return_date': return_date
            })

            try:
                fine_response = requests.post(FINE_SERVICE_URL, json={
                    "issue_date": issue_date,
                    "return_date": return_date
                })
                fine_response.raise_for_status()
                fine = fine_response.json().get('fine', 0)
                return {
                    "message": "Book returned",
                    "user_id": user_id,
                    "book_id": book_id,
                    "issue_date": issue_date,
                    "return_date": return_date,
                    "fine": fine
                }, 200
            except Exception as e:
                return {"message": f"Error contacting Fine Service: {str(e)}"}, 500

    return {"message": "Record not found"}, 404

@app.route('/issued', methods=['GET'])
def get_issued_books():
    return jsonify(issued_books)

@app.route('/fine/<int:user_id>', methods=['POST'])
def calculate_fine_for_user(user_id):
    data = request.json
    return_date = data.get('return_date')
    if not return_date:
        return {"message": "Please provide return_date in body"}, 400

    user_books = [b for b in issued_books if b['user_id'] == user_id]
    user_books += [b for b in history_books if b['user_id'] == user_id]

    if not user_books:
        return {"message": "No books issued by this user"}, 404

    total_fine = 0
    fine_details = []

    for book in user_books:
        issue_date = book['issue_date']
        try:
            fine_response = requests.post(FINE_SERVICE_URL, json={
                "issue_date": issue_date,
                "return_date": return_date
            })
            fine_response.raise_for_status()
            fine = fine_response.json().get('fine', 0)
            total_fine += fine
            fine_details.append({
                "book_id": book['book_id'],
                "issue_date": issue_date,
                "return_date": return_date,
                "fine": fine
            })
        except Exception as e:
            fine_details.append({
                "book_id": book['book_id'],
                "error": f"Could not calculate fine: {str(e)}"
            })

    return jsonify({
        "user_id": user_id,
        "total_fine": total_fine,
        "details": fine_details
    })

@app.route('/records/<int:user_id>', methods=['GET'])
def get_user_records(user_id):
    user_records = [r for r in issued_books + history_books if r['user_id'] == user_id]
    if not user_records:
        return {"message": "No issued books found for this user"}, 404
    return jsonify(user_records), 200

if __name__ == '__main__':
    print("Swagger UI available at: http://localhost:5002/swagger")
    app.run(host='0.0.0.0', port=5002, debug=True)
