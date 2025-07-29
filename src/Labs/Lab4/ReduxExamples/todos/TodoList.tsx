
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import {useSelector} from "react-redux";
import { ListGroup } from "react-bootstrap";

export default function TodoList() {
    const {todos} = useSelector((state: any) => state.todosReducer);

  return (
    <div>
      <h2>Todo List</h2>
      <ListGroup>
      <ListGroup.Item>
      <TodoForm/>
       
  </ListGroup.Item>
  {todos.map((todo:any) => (
  <ListGroup.Item>
  <TodoItem
            todo={todo}
        />
          </ListGroup.Item>))}

      </ListGroup><hr/>
</div>);}