// Use Nodemeon in package.json file under "scripts": { "server": "nodemon index.js" }

const express = require('express'); // Imports the Express package...

const Hubs = require('./data/hubs-model.js'); // We'll use Hubs to access the database...

// global objects
const server = express(); // This creates a server...

// middleware
server.use(express.json());

var time = new Date();
server.get('/now', (reg, res) => {
  // Server needs things
  // What is the datatype? 
  // What is the status code? 
  // Express will default to a 200 status code. 

    // What am I sending back? 
  res.send('<h1>Index gotten</h1>' + ' ' + '<h4>' + time.toISOString() + '</h4>');
});


// GET /
server.get('/hubs', (req, res) => { // This is a route handler...
  // res.send('Hello World' + ' ' + 'Give me a break!');
  // Hubs.find() returns a promise. 
  Hubs.find().then(hubs => {
    console.log(hubs)
    // .json will covert the data passed to json...
    // Also tells the client we're sending json through an HTTP header
    res.status(200).json(hubs);
  }).catch(error => {
    // 500 code sent if there is a message sending the data back...
    res.status(500).json({ message: 'error getting the list of hubs' })
  })
});

// POST /
server.post('/hubs', (req, res) => {
	const newHub = req.body;
	console.log('new hub', newHub);
	// Can add validating here. 
	Hubs.add(newHub).then(hubs => {
		res.status(201).json(hubs);
	})
	.catch(error => {
		res.status(500).json({
			error: error,
			message: 'failed to create new hub'
		});
	});
});

// DELETE /hubs/:id
server.delete('/hubs/:id', (req, res) => {
	const { id } = req.params;
	// const id = req.params.id This line does the same as the line above it. 
	Hubs.remove(id)
		.then(deletedHub => {
			// Send error if the id does not exist.
			if(deletedHub) {
				res.json(deletedHub);
			} else {
				res.status(404).json({
					message: 'invalid hub id'
				});
			}
		})
		.catch(error => {
			res.status(500).json({
				error: error,
				message: 'failed to destroy hub'
			});
		});
});

// PUT /hubs/:id
// Updates specified data. 
server.put('/hubs/:id', (req, res) => {
	const { id } = req.params;
	const changes = req.body;

	Hubs.update(id, changes)
		.then(updated => {
			if(updated) {
				res.json(updated);
			} else {
				res.status(404).json({
					message: 'invalid hub id'
				});
			}
		})
		.catch(error => {
			res.status(500).json({
				error: error,
				message: 'failed to update hub'
			});
		});
})

server.get('/hubs/:id', (req, res) => {

});

// server.get('/hobbits', (req, res) => {
//   const hobbits = [x
//     {
//       id: 1,
//       name: 'Samwise Gamgee',
//     },
//     {
//       id: 2,
//       name: 'Frodo Baggins',
//     },
//   ];

//   res.status(200).json(hobbits);
// });

// This line is to make the server from express actually work. 
server.listen(8000, () => console.log('API running on port 8000'));