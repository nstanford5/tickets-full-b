import './App.css';
import {loadStdlib} from '@reach-sh/stdlib';
import {ALGO_MyAlgoConnect as MyAlgoConnect} from '@reach-sh/stdlib';
import * as backend from './reach/build/index.main.mjs';
import {views, Loader} from './utils';
import {SelectRole, CurrentSale, GetParams} from './screens';
import {useState} from 'react';
const stdlib = loadStdlib('ALGO');
stdlib.setWalletFallback(stdlib.walletFallback({
  providerEnv: 'TestNet',
  MyAlgoConnect
}));

function App() {
  const [view, setView] = useState(views.SELECT_ROLE);
  const [params, setParams] = useState();
  const startUp = async () => {
    // set the view to get parameters
    setView(views.GET_PARAMS);
  };
  /**
   * 
   * This could be  updated to split the token minting to an optional button
   */
  const setP = async (cost, count) => {
    const accA = await stdlib.getDefaultAccount();
    const ctcA = accA.contract(backend);
    const tickets = await stdlib.launchToken(accA, "Tickets", "TIX", {supply: count});
    setParams({
      tok: tickets.id,
      cost: stdlib.parseCurrency(cost),
      supply: count,
    });
    console.log(`setP complete`);
    backend.Admin(ctcA, Admin);
  };
  const Admin = {
    getParams: () => {
      console.log(`Sending parameters to blockchain`);
      // params is undefined here
      return params;
    },
    launched: (contract) => {
      console.log(`Ready at contract: ${contract}`);
      setView(views.CURRENT_SALE);
    },
  };
  return (
    <div className="App">
      <header className="App-header">
        {view === views.SELECT_ROLE && 
          <SelectRole start={startUp}/>}
        {view === views.GET_PARAMS &&
          <GetParams deploy={setP}/>}
        {view === views.CURRENT_SALE &&
          <CurrentSale />}
      </header>
    </div>
  );
}

export default App;
