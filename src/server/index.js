const express = require("express");
var fs = require('fs');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser')


const app = express();
app.use(express.static("dist"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/getagreement", (req, res) => {
    var file = fs.createReadStream(path.join(__dirname, 'USER_MANUAL_OP6_FINAL.pdf'));
    var stat = fs.statSync(path.join(__dirname, 'USER_MANUAL_OP6_FINAL.pdf'));
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=aggrement.pdf');
    file.pipe(res);
});

app.get("/downloadagreement", (req, res) => {
    let id = req.query.id;
    console.log(req.query)
    let fileName = req.params.fileName;
    res.setHeader("content-disposition", "attachment; filename=logo.png");
    var options = {
        method: 'GET',
        url: "https://ext.digio.in:444/v2/client/document/download?document_id=" + id,
        headers: {
            'authorization': 'Basic QUk0SDE3VTFMVFhYRk40V1lWUURXRjdTWkEzRjYxNkM6Tk9PWVVISFM1UFk4R0JCRzZZNkozUzhZTU8zNFpSNEI='
        }
    };
    request(options).pipe(res);
});

app.post("/uploadagreement", (req, res) => {
    var base64str = base64_encode(path.join(__dirname, 'USER_MANUAL_OP6_FINAL.pdf'));
    console.log("emailMobile", req.body.emailMobile)
    var options = {
        method: 'POST',
        body: {
            "signers": [{
                "identifier": req.body.emailMobile,
                "reason": "Go Agreement sign"
            }],
            "expire_in_days": 10,
            "display_on_page": "all",
            "file_name": "agreement.pdf",
            "file_data": base64str
        },
        json: true,
        url: 'https://ext.digio.in:444/v2/client/document/uploadpdf',
        headers: {
            'authorization': 'Basic QUk0SDE3VTFMVFhYRk40V1lWUURXRjdTWkEzRjYxNkM6Tk9PWVVISFM1UFk4R0JCRzZZNkozUzhZTU8zNFpSNEI=',
            "content-type": "application/json"
        }
    };

    console.log("***sending request***")

    request.post(options, function optionalCallback(err, httpResponse, body) {
        console.log("***success***", err)
        if (err) {
            console.log('Upload error!  Server responded with:', err);
            res.status(500).send(err);
        } else {
            console.log("body", body)
            res.setHeader('Content-Type', 'application/json');

            if (body) {
                res.send(JSON.stringify(body));
            } else {
                res.send({});
            }
        }
    });

});


function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

app.listen(7001, () => console.log("Listening on port 7001!"));