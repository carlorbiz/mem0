API_KEY = "carla_knowledge_lake_2025"  # Your secret key

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Simple in-memory storage for now
knowledge_store = []

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'service': 'carla_knowledge_lake',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/knowledge/search', methods=['GET'])
def search_knowledge():
    query = request.args.get('query', '')
    # Simple search
    results = [item for item in knowledge_store if query.lower() in item.get('content', '').lower()]
    
    return jsonify({
        'results': results,
        'query': query,
        'count': len(results),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/knowledge/add', methods=['POST'])
def add_knowledge():
    data = request.get_json()
    
    knowledge_entry = {
        'id': len(knowledge_store) + 1,
        'content': data.get('content', ''),
        'metadata': data.get('metadata', {}),
        'timestamp': datetime.now().isoformat()
    }
    
    knowledge_store.append(knowledge_entry)
    
    return jsonify({
        'status': 'added',
        'id': knowledge_entry['id'],
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Starting Carla's Simple Knowledge Lake API...")
    print("📍 API will be available at: http://localhost:5000" )
    app.run(host='127.0.0.1', port=5000, debug=True)
