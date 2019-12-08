from flask import Flask
from flask import request

app = Flask(__name__)

from fairseq.models.roberta import RobertaModel

model_name = "Roberta"
model = None

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/predict', methods=['POST'])
def predict():
    return jsonify({'class_id': 'IMAGE_NET_XXX', 'class_name': 'Cat'})

def load_model_internal():
	PATH='./roberta.base'
	return RobertaModel.from_pretrained(PATH)

@app.route('/loadModel')
def loadModel():
	global model
	if model:
		return f'Model {model_name} already loaded.'
	else:
		print(f'Model {model_name} not loaded, loading now')
		model = load_model_internal()
		model.eval()
		return f'Model {model_name} loaded'

@app.route('/evalModel')
def evalModel():
	global model
	if model:
		print("Model loaded, evaluating now")
		model.eval()
		return f'Finished evaluating Model {model_name}'
	else:
		return f'Model {model_name} not loaded, call the /loadModel endpoint'

@app.route('/askQuestion')
def askQuestion():
	question = request.args.get('question')

	global model
	if not model:
		model = load_model_internal()

	print('question: ', question)
	answer = model.fill_mask(question, topk=3)
	if answer: 
		answer = answer[0][0]
	
		print('answer: ', answer)
		return answer
	else:
		answer = "<No answer(s) returned>"
		print('answer: ', answer)
		return answer