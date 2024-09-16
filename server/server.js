const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const path=require('path');

const app=express();
const PORT=3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/save-asm', (req, res) => {

    const {content} = req.body;

    if(!content){
        return res.status(400).send('content is required');
    }

    const filePath=path.join(__dirname, 'test.asm');

    fs.writeFile(filePath, content, (err) => {
        if(err){
            console.error('error saving file:', err);
            return res.status(500).send('Failed to save file');
        }

        res.send('File saved as test.asm')
    });

});

app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`);
});
