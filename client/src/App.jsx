import React, {useState} from "react";
import './App.css';

function App() {
  const [content, setContent] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

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


  return(
    <div className="App">
      <h1> Submit Asm File content</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">File content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e)=>setContent(e.target.value)}
            rows="10"
            cols="50"
            required
            ></textarea>
        </div>
        <br />
        <button type="submit">Save as test.asm</button>
      </form>
      <p>{responseMessage}</p>
    </div>
  );
}

export default App;
