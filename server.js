require('dotenv').config()
const CORS = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(bodyParser.json())
app.use(CORS());


app.post('/api/lambda', 
	body('key1').isString().notEmpty(),
	(request, response)	 => {

	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}

	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
		region: process.env.AWS_REGION
	});

	const lambda = new AWS.Lambda()
	const FunctionName = 'hello-world-lambda'

	let params = {
		FunctionName: FunctionName,
		Payload: JSON.stringify({
			"key1": body.key1
		})
	};

	lambda.invoke(params, function(error, data) {
		if (error){
			console.log(error, error.stack);
			response.send(JSON.stringify(error.stack))
		} 
		else {
			response.status(JSON.parse(data.Payload).statusCode);
			response.send(JSON.parse(data.Payload));
		} 
	});
});

app.listen(5001, () =>			 {
	console.log('Server listening on port 5001');
});

	