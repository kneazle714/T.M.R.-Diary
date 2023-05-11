import React, { useState, useEffect } from 'react';
// import { render } from 'react-dom';
import './styles.css';

function App() {
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');

  // useEffect(() => {
  //   fetch("http://localhost:8080/diary")
  //     .then((res) => res.json())
  //     .then((data) => setPrompt(data));
  // }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(input);

    if (/^\d/.test(input)) {
      const splitInput = input.split(':');
      const date = splitInput[0];
      const content = splitInput[1].trim();

      fetch('/creatediary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date, content: content }),
      })
        .then((data) => data.json())
        .then((data) => {
          console.log(data);
          setReply(data);
        })
        .catch((err) => {
          console.log(err);
          console.log('failed creating memory');
        });
    } else if (input.startsWith('What')) {
      const splitInput = input.split('on');
      const date = splitInput[1].trim();
      fetch('/finddiary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date }),
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          setReply(data);
        })
        .catch((err) => {
          console.log(err);
          console.log('failed finding memory');
        });
    } else if (input.startsWith('Change')) {
      // Change my memory on 5.2 to: Slytherin won 50 points because of me.
      const firstSplit = input.split(':');
      const content = firstSplit[1].trim();
      const secondSplit = firstSplit[0].split('on');
      const secondSplitTrimmed = secondSplit[1].trim();
      const thirdSplit = secondSplitTrimmed.split('to');
      const date = thirdSplit[0].trim();

      fetch('/updatediary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date, content: content }),
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          setReply(data);
        })
        .catch((err) => {
          console.log(err);
          console.log('failed updating memory');
        });
    } else if (input.startsWith('Delete')) {
      // Delete my memory on 5.2
      const splitInput = input.split('on');
      const date = splitInput[1].trim();

      fetch('/deletediary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date }),
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          setReply(data);
        })
        .catch((err) => {
          console.log(err);
          console.log('failed deleting memory');
        });
    } else if (input.startsWith('Hello')) {
      fetch('/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          setReply(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (input.startsWith('Who')) {
      fetch('/who', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          setReply(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setInput('');
    setReply('');
   }

  // class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     date: '',
  //     content: ''
  //   };
  //   // this.handleSubmit = this.handleSubmit.bind(this);
  //   // this.handleInput = this.handleInput.bind(this);
  // }
  // render() {
  return (
    <div className='app' onClick={handleSubmit} >
      <div className='background-image'>
      <form autocomplete="off">
        <input
          id='input'
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        ></input>
      </form>
      <input 
      id='response'
      type="text" 
      value={reply}></input>
      </div>
      </div> 
  )
  }

export default App;
