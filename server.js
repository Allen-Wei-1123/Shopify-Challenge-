// app.js
const express = require('express')
var fs = require("fs");
const { type } = require('os');
const app = express()

app.use(express.json());
app.use(express.urlencoded());

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-Width,Content-Type,Accept");
    next();
});

//Add Inventory
app.post('/Add',function(req,res){
    var obj;
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body)
    fs.readFile( __dirname + "/" + "infos.json", 'utf8', function (err, data) {

        var obj = JSON.parse(data)
        
        obj.push(req.body)
        var ans = JSON.stringify(obj);
        fs.writeFileSync(__dirname + "/" + "infos.json",ans); 
        
     });
})

app.post('/Edit',function(req,res){
    var obj;
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body)
    fs.readFile( __dirname + "/" + "infos.json", 'utf8', function (err, data) {

        var obj = JSON.parse(data);
        var targetID = req.body["id"]
        
        //var newobj = obj.filter((value, index, array)=>{value.id != targetID});
        var newobj = [];
        for(const x of obj){
            if(x.id == targetID){
                if(req.body['name'].length > 0){
                    x['name'] = req.body['name']
                }
                if(req.body['price'].length > 0 ){
                    x['price'] = req.body['price']
                }
                if(req.body['cnt'].length> 0 ){
                    x['cnt'] = req.body['cnt']
                }
            }
            newobj.push(x);
        }
        var ans = JSON.stringify(newobj);

        fs.writeFileSync(__dirname + "/" + "infos.json",ans); 
        
     });
})

app.delete('/Delete/:id',(req,res)=>{
    var obj;
    res.header("Access-Control-Allow-Origin", "*");
    fs.readFile( __dirname + "/" + "infos.json", 'utf8', function (err, data) {

        var obj = JSON.parse(data);
        var targetID = req.params.id;
        
        //var newobj = obj.filter((value, index, array)=>{value.id != targetID});
        var newobj = [];
        for(const x of obj){
            if(x.id != targetID){
                newobj.push(x);
            }
        }
        var ans = JSON.stringify(newobj);

        fs.writeFileSync(__dirname + "/" + "infos.json",ans); 
        
     });
})



// A sample route
app.get('/', (req, res)=> {
    var obj;
    res.header("Access-Control-Allow-Origin", "*");
    fs.readFile( __dirname + "/" + "infos.json", 'utf8', function (err, data) {
        // res.end( data );
        
        res.end(data);

     });
})

function SearchAndDelete(fileobj,targetID, targetCnt){
    targetCnt = parseInt(targetCnt);
    for(const x of fileobj){
        if(x['id'] == targetID && parseInt(x['cnt']) >= targetCnt){
            var tmp = parseInt(x['cnt']) - targetCnt;
            x['cnt'] = ""+tmp;
            break;
        }
    }
    return fileobj;
}

app.post('/Shipment',(req,res)=>{
    var obj;
    res.header("Access-Control-Allow-Origin", "*");
    fs.readFile( __dirname + "/" + "infos.json", 'utf8', function (err, data) {
        // res.end( data );
        
        var fileobj = JSON.parse(data); 
        var getobj = req.body;

        var tmpfileobj = SearchAndDelete(fileobj,getobj['item1ID'],getobj['item1Cnt'])
        tmpfileobj = SearchAndDelete(tmpfileobj,getobj['item2ID'],getobj['item2Cnt'])
        tmpfileobj = SearchAndDelete(tmpfileobj,getobj['item3ID'],getobj['item3Cnt'])

        const result = tmpfileobj.filter(tmpobj => parseInt(tmpobj['cnt']) > 0);
        
        var ans = JSON.stringify(result);

        fs.writeFileSync(__dirname + "/" + "infos.json",ans); 
     });
})

// Start the Express server
app.listen(3000, () => console.log('Server running on port 3000!'))