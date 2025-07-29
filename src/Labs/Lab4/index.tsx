import ArrayStateVariable from "./ArrayStateVariable";
import BooleanStateVariables from "./BooleanStateVariables";
import ClickEvent from "./ClickEvent";
import Counter from "./Counter";
import DateStateVariable from "./DateStateVariable";
import EventObject from "./EventObject";
import ObjectStateVariable from "./ObjectStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import ReduxExamples from "./ReduxExamples/Index";
import StringStateVariables from "./StringStateVariables";

function sayHello() {
    alert("Hello");
  }


export default function Lab4() {
    return (
        <div id="wd-passing-functions">
        <h2>Lab 4</h2>
            <ClickEvent />
            <PassingDataOnEvent a={2} b={3} />
            <PassingFunctions theFunction={sayHello} />
            <EventObject/>
            <Counter />
            <BooleanStateVariables/>
            <StringStateVariables/>
            <DateStateVariable/>
            <ObjectStateVariable />
            <ArrayStateVariable />
            <ParentStateComponent/>
            <ReduxExamples/>


        </div>
    )
}
