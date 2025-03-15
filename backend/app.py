from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import io
import traceback
import contextlib
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/execute', methods=['POST'])
def execute_code():
    code = request.json.get('code', '')
    
    # Capture stdout and stderr
    stdout = io.StringIO()
    stderr = io.StringIO()
    
    result = {
        'output': '',
        'error': None,
        'visualizations': []
    }
    
    try:
        # Execute the code and capture output
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            exec(code, {})
        
        output = stdout.getvalue()
        if output:
            result['output'] = output
        
        # Check for matplotlib plots
        if 'matplotlib.pyplot' in code or 'plt.' in code:
            # In a real implementation, you would save the plot to a file
            # and return the file path or base64 encoded image
            result['visualizations'].append({
                'type': 'matplotlib',
                'data': 'base64_encoded_image_would_go_here'
            })
            
    except Exception as e:
        error_message = stderr.getvalue() or traceback.format_exc()
        result['error'] = error_message
        result['output'] = f"Error: {str(e)}"
    
    return jsonify(result)

@app.route('/api/ai/suggest', methods=['POST'])
def suggest_code():
    prompt = request.json.get('prompt', '')
    
    # In a real implementation, you would call an AI service
    # For now, return a simple suggestion
    suggestion = f"# Here's a suggestion for: {prompt}\ndef example_function():\n    print('Hello, world!')"
    
    return jsonify({'suggestion': suggestion})

if __name__ == '__main__':
    app.run(debug=True, port=5000)