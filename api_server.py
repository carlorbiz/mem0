from flask import Flask, request, jsonify
from flask_cors import CORS
from mem0 import Memory
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests
memory = Memory()

@app.route('/knowledge/search', methods=['GET'])
def search_knowledge():
    query = request.args.get('query')
    user_id = request.args.get('user_id', 'carla_knowledge_lake')
    results = memory.search(query=query, user_id=user_id, limit=10)
    return jsonify({'results': results, 'timestamp': datetime.now().isoformat()})

@app.route('/knowledge/add', methods=['POST'])
def add_knowledge():
    data = request.get_json()
    memory.add(
        messages=data['content'], 
        user_id=data.get('user_id', 'carla_knowledge_lake'),
        metadata=data.get('metadata', {})
    )
    return jsonify({'status': 'added', 'timestamp': datetime.now().isoformat()})

@app.route('/knowledge/context/<topic>', methods=['GET'])
def get_context(topic):
    results = memory.search(query=topic, user_id='carla_knowledge_lake', limit=5)
    return jsonify({'context': results, 'topic': topic})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'mem0_knowledge_lake'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)

