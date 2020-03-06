const express = require('express');
const bodyParser = require('body-parser');
const mongoIO = require('./io.js');

const collectionName = 'candidates';
const app = express();
const port = process.env.PORT || 3000;

var staticPath = 'static';	
app.use(
	express.static(staticPath)
);

app.use(bodyParser.urlencoded({ extended: false }));  // <-- make request body data available
app.use(bodyParser.json())


/*
we want a route to write data into the database...

routes connect url paths to controller function
*/

function writeData(req, res, next) {
	// This is the controller function
	try {
		console.log(req.body)
		mongoIO.writeItem(req.body, collectionName);
		res.send(req.body);	
	} catch (err) {
		next(err);
	}
}

app.post('/api/pokemons', writeData)


function readData(req, res, next) {
	function sendDataCallback(err, data) {
		if (err) {
			next(err)
			return
		}
		res.json(data)
	}

	mongoIO.readItems(sendDataCallback, collectionName);	
}

app.get('/api/pokemons', readData)


function deleteData(req, res, next) { // Even your error handling has to be checked! Originally forgot to include next
    try {
        var title = req.body.title;
        console.log(`Trying to delete: ${title}`);
        mongoIO.deleteItem({title: req.body.title});
        req.body.status = 'deleted';
        console.log(`Deleted ${title}`);
        res.send(req.body);  // We send this back, because the event will be out of context in the browser
    } catch (e) {
        next(`Ouch! ${e}`);
    }
    
}

app.delete('/api/pokemons', deleteData)


app.listen(port, function() {console.log(`Pokemon app listening on port ${port}!`)})