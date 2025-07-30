const add = (a: number, b: number) => {
    alert(`${a} + ${b} = ${a + b}`);
  };
  export default function PassingDataOnEvent({a,b}: {a: number, b: number}) {
    return (
      <div id="wd-passing-data-on-event">
        <h2>Passing Data on Event</h2>
        <button onClick={() => add(a, b)}
                // onClick={add(2, 3)}
                className="btn btn-primary"
                id="wd-pass-data-click">
          Pass 2 and 3 to add()
        </button>
        <hr/>
      </div>
  );}
  