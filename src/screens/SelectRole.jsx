import './index.css';

export function SelectRole({start}){
  return(
    <div className='section'>
      <h2>Please Select a Role</h2>
      <button className='button' onClick={() => start()}>Sell tickets</button>
    </div>
  )
}