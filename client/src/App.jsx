import React, {useState} from "react";
import MonacoEditor from '@monaco-editor/react'
;import './App.css';

function App() {
  const [content, setContent] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [compilationMessage, setCompilationMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const response = await fetch('/save-asm', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({content}),
      });

      const message = await response.text();
      setResponseMessage(message);
    } catch (error) {
      setResponseMessage('Error: '+error.message);
    }
  };
  
  const handleCompile = async () => {
    try {
      console.log("Content being compiled:", content); // For debugging
      const response = await fetch('/compile-asm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }), // Send the content to be compiled
      });

      const result = await response.text();
      setCompilationMessage(result); // Display compilation result
    } catch (error) {
      setCompilationMessage('Error: ' + error.message);
    }
  };



  return(
    <div className="App">
      <h1> Submit Asm File content</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <MonacoEditor
            height="400px"
            width="600px"
            language="asm"
            theme="vs-dark"
            value={content}
            onChange={(value) => setContent(value)}
            options={{
              automaticLayout: true,
              minimap: { enabled: false },
            }}
          />
        </div>
        <br />
        <button type="submit">Save as test.asm</button>
      </form>
      <p>{responseMessage}</p>
      
      <button onClick={handleCompile}>Compile Code</button>
      <p>{compilationMessage}</p> {/* Compilation result */}
    </div>
  );
}

export default App;
