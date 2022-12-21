'reach 0.1';

export const main = Reach.App(() => {
  const A = Participant('Admin', {
    getParams: Fun([], Object({
      cost: UInt,
      tok: Token,
      supply: UInt,
    })),
    launched: Fun([Contract], Null),
  });
  const B = API('Buyer', {
    buyTicket: Fun([], Null),
  });
  const V = View({
    cost: UInt,
    ticketsLeft: Fun([], UInt),
  })
  init();

  A.only(() => {
    const {cost, tok, supply} = declassify(interact.getParams());
  });
  A.publish(cost, tok, supply);
  commit();
  A.pay([[supply, tok]]);
  V.cost.set(cost);
  V.ticketsLeft.set(() => supply);
  A.interact.launched(getContract());

  const [ticketsSold] = parallelReduce([0])
    .define(() => {
      const left = () => {
        const t = supply - ticketsSold;
        return t;
      }
      V.ticketsLeft.set(left);
    })
    .invariant(balance() == cost * ticketsSold)
    .invariant(balance(tok) == supply - ticketsSold)
    .while(ticketsSold < supply)
    .api_(B.buyTicket, () => {
      check(ticketsSold != supply, "sorry, out of tickets");
      return[cost, (ret) => {
        transfer(1, tok).to(this);
        ret(null);
        return [ticketsSold + 1];
      }];
    });
  transfer(cost * ticketsSold).to(A);
  commit();
  exit();
});
