import './index.css';
import {useState} from 'react';

// here you need to show 2 text areas
// send the values back to App.js,
// to eventually go back to the contract
export function GetParams({deploy}){
  const [count, setCount] = useState(0);
  const [cost, setCost] = useState();
  return(
    <div className='section'>
      <textarea className='textline' placeholder='how many?' onChange={e => setCount(e.target.value)}></textarea>
      <textarea className='textline' placeholder='cost?' onChange={e => setCost(e.target.value)}></textarea>
      <button className='button' onClick={() => deploy(cost, count)}>Deploy Contract</button>
    </div>
  )
}