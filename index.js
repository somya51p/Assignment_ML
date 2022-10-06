const express = require('express')
const app = express()

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
};

app.use(express.json());
app.use(allowCrossDomain);

const port = 3000

let grid = new Array(20);
for(let i=0;i<20;i++) {
	grid[i]= new Array(60);
	for(let j=0;j<60;j++) {
		grid[i][j] = 0;
	}
}

let curr = [-1,-1];
let focusFlag = 0;
let captureFlag = 0;


async function initiateFocus(coordinates) {
	focusFlag=1;
	setTimeout(() => {
		console.log("focussing done for coordinates");
		
		grid[coordinates[0]][coordinates[1]]=1;
		focusFlag=0;
	}, 3000)
}

async function initiateCapture(coordinates) {
	captureFlag=1;
	setTimeout(() => {
		console.log("capturing done for coordinates");
		grid[coordinates[0]][coordinates[1]]=2;
		captureFlag=0;
	}, 2000);
}

function processInput(inp) {
	if(inp == 'right') {
		curr[1]++;
	}
	else if(inp == 'up') {
		curr[0]--;
	}
	else if(inp == 'down') {
		curr[0]++;
	}
	else {
		curr[1]--;
	}
}

app.get('/input', (req, res) => {
	let inp = req.query.inp;
	if (curr[0] == -1 || curr[1] == -1) {
		curr[0] = 0;
		curr[1] = 0;
		return res.status(200).send();
	}
	console.log(inp);
    if( grid[curr[0]][curr[1]] != 1 && grid[curr[0]][curr[1]] != 2) {
        grid[curr[0]][curr[1]] = -1;
    }
	console.log("input reached");
    processInput(inp);
	res.status(200).send();
});

app.get('/getGrid', (req, res) => {
	res.send(grid);
})

async function statusChecker(){
	if(focusFlag == 1 || captureFlag == 1 || curr[0] == -1 || curr[1] == -1) {
		setTimeout(statusChecker, 100);
		return;
	}
    if(grid[curr[0]][curr[1]] == 0) {
        initiateFocus(curr);
    }
	else if(grid[curr[0]][curr[1]] == 1) {
		initiateCapture(curr);
	}
	setTimeout(statusChecker, 100);
}

app.listen(port, () => {
	statusChecker();
	console.log(`app listening on ${port}`);
})