const express = require ('express')
const app = express()
const path = require ('path')
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.static( path.join ( __dirname , 'public' ) ))
app.use(express.json())
app.use(express.urlencoded( { extended: true }))



app.get("/", function (req, res) {
    try {
        const files = fs.readdirSync("./files");
        const data = [];
        files.forEach((file) => {
            const filePath = path.join(__dirname, "files", file);
            const fileContent = fs.readFileSync(filePath, "utf8");
            data.push({
                name: file,
                description: fileContent,
            });
        });
        res.render("index", { title: "homepage", data });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error reading directory");
    }
});
// script.js

app.post('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'files', filename);

    fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
            console.error(unlinkErr);
            res.status(500).send('Error deleting file');
        } else {
            res.redirect('/');
        }
    });
});

app.get("/create", (req,res)=> {
    res.render('create')
})

app.post("/create", (req, res) => {
    try {
        fs.writeFileSync(`./files/${req.body.filename}`, req.body.description);
        console.log("File written successfully");
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating file");
    }
});



app.listen(3000)