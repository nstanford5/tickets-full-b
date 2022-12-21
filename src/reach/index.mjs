import { loadStdlib } from "@reach-sh/stdlib";
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib({REACH_NO_WARN: 'Y'});
const MAX = 5;
const GAS_LIMIT = 5000000;
const accA = await stdlib.newTestAccount(stdlib.parseCurrency(100));
accA.setGasLimit(GAS_LIMIT);
const ctcA = accA.contract(backend);
const tickets = await stdlib.launchToken(accA, "Tickets", "TIX", {supply: MAX});
console.log('Welcome to the ticket distributor\nLets get you a ticket');

const startBuyers = async () => {
  const runBuyer = async (i) => {
    const acc = await stdlib.newTestAccount(stdlib.parseCurrency(100));
    await stdlib.transfer(accA, acc, stdlib.parseCurrency(1));
    acc.setGasLimit(GAS_LIMIT);
    const ctc = acc.contract(backend, ctcA.getInfo());
    await acc.tokenAccept(tickets.id);
    if(i == 0){
      const b = await ctc.v.ticketsLeft();
      console.log(`Tickets remaining: ${b[1]} intially`);
    }
    const c = await ctc.v.cost();
    const ct = stdlib.fromSome(c, 0);
    console.log(`User ${i + 1} sees the ticket cost is: ${stdlib.formatCurrency(ct)}`);
    try{
      await ctc.apis.Buyer.buyTicket();
      console.log(`Purchase successful`);
    } catch(e){
      console.log(e);
    }
    const left = await ctc.v.ticketsLeft();
    const tLeft = stdlib.fromSome(left, 0);
    console.log(`Tickets remaining: ${stdlib.bigNumberToNumber(tLeft)}`);
  }// end of runBuyer
  for(let i = 0; i < MAX; i++){
    await runBuyer(i);
  }
}// end of startBuyers

await ctcA.p.Admin({
  params: {
    tok: tickets.id,
    cost: stdlib.parseCurrency(1),
    supply: MAX,
  },
  launched: async (contract) => {
    console.log(`Ready at contract: ${contract}`);
    await startBuyers();
  },
}),
console.log('Exiting...');
