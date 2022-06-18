const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const db = require('./db')();
const Links = require('./links');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend", "build")));
app.use(express.static("public"));


const isValidURL = (string) => {
    const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null);
};

const isProtocolExists = (string) => {
    const res = string.match(/^(http|https)/);
    return (res !== null);
}

const makeRandomUniqueLink = async() => {
    let str = shortid.generate();

    const res = await Links.findOne({ link: str });

    if(res) return makeRandomUniqueLink();
    return str;
}

app.post('/makeShortLink', bodyParser.json(), async(req, res) => {
    let { link } = req.body;

    if(!isProtocolExists(link)) {
        link = 'http://' + link;
    }

    // Плохо что так не работает :(
    //link = link.toLowerCase();
    
    if(!isValidURL(link)) {
        res.json({ success: false, error: 'Link is not valid' });
    }

    let result = await Links.findOne({ source: link });

    if(result) {
        return res.json({ success: true, link: req.headers.origin + "/" + result.link });
    }

    let randstr = await makeRandomUniqueLink();

    const data = await new Links({
        link: randstr,
        source: link
    }).save();

    return res.json({ success: true, link: req.headers.origin + "/" + data.link });
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
})

app.get('/:id', async(req, res) => {
    const { id: slug } = req.params;

    console.log(slug);

    let result = await Links.findOne({ link: slug });

    if(!result) return res.json({ success: false, error: "Link not found" });

    return res.redirect(result.source);
})

app.post('/getLink', bodyParser.json(), async(req, res) => {
    const { link } = req.body;

    let result = await Links.findOne({ link: link });

    if(!result) return res.json({ success: false, error: "Link not found" });

    return res.json({ success: true, source: result.source });
})

app.listen(80, () => {
    console.log('Launched!');
});