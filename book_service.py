from flask import Flask, request, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

books = []  # In-memory list for books

@app.route('/')
def home():
    return "Book Service is running"

@app.route('/books', methods=['GET'])
def get_books():
    return jsonify(books)

@app.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    for book in books:
        if book['id'] == book_id:
            return jsonify(book)
    return {"message": "Book not found"}, 404

@app.route('/books', methods=['POST'])
def add_book():
    book = request.json
    if not book or 'id' not in book or 'title' not in book:
        return {"message": "Missing required fields: id, title"}, 400
    
    # Check if book ID already exists
    if any(b['id'] == book['id'] for b in books):
        return {"message": "Book with this ID already exists"}, 400
    
    books.append(book)
    return jsonify(book), 201

@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book_data = request.json
    for i, book in enumerate(books):
        if book['id'] == book_id:
            books[i].update(book_data)
            return jsonify(books[i])
    return {"message": "Book not found"}, 404

@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    for i, book in enumerate(books):
        if book['id'] == book_id:
            deleted_book = books.pop(i)
            return jsonify({"message": "Book deleted", "book": deleted_book})
    return {"message": "Book not found"}, 404

# Swagger UI configuration
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger_book.yaml'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL, API_URL, config={'app_name': "Library SOA Book Service API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

if __name__ == '__main__':
    print("Swagger UI available at: http://localhost:5001/swagger")
    app.run(host='0.0.0.0', port=5001, debug=True)
