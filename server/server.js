const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const path=require('path');
const { exec } = require('child_process');

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

        res.status(200).send('File saved as test.asm')
    });

});

app.post('/compile-asm', (req, res) => {
  const { content } = req.body;

  // Ensure the content exists
  if (!content) {
      return res.status(400).send('Content is required for compilation.');
  }

  const filePath = path.join(__dirname, 'test.asm');

  // Save ASM content to file
  fs.writeFileSync(filePath, content);

  // Run NASM compiler command
  exec('nasm -f win32 test.asm -o test.o', (err, stdout, stderr) => {
      if (err) {
          console.error('Error compiling file:', stderr);
          return res.status(500).send('Compilation failed: ' + stderr);
      }
      else{
        console.log("successfully compiled!");
        exec('ld test.o -o test.exe',(er,stdo,stde)=>{
          if(er)
          {
            console.log(er);
          }
          else{
            exec('test.exe', (er1, stdo1, stde1)=>{
              if(er1){
                console.log(er1);
              }
              else{
                console.log(stdo1);
              }
            })
          }
        })
        
      }

      res.send('Compilation successful. Output saved as test.o');
  });
});


app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`);
});
