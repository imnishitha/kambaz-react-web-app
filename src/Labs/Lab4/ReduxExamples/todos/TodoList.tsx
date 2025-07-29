import React, { useState } from "react";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import { Button, FormControl, ListGroup } from "react-bootstrap";
import { deleteTodo, addTodo, updateTodo, setTodo } from "./todosReducer";
export default function TodoList() {
    const {todos, todo} = useSelector((state: any) => state.todosReducer);
    const dispatch = useDispatch();
//   const [todos, setTodos] = useState([
//     { id: "1", title: "Learn React" },
//     { id: "2", title: "Learn Node"  }]);
//   const [todo, setTodo] = useState({ id: "-1", title: "Learn Mongo" });
//   const addTodo = (todo: any) => {
//     const newTodos = [ ...todos, { ...todo,
//       id: new Date().getTime().toString() }];
//     setTodos(newTodos);
//     setTodo({id: "-1", title: ""});
//   };
//   const deleteTodo = (id: string) => {
//     const newTodos = todos.filter((todo) => todo.id !== id);
//     setTodos(newTodos);
//   };
//   const updateTodo = (todo: any) => {
//     const newTodos = todos.map((item) =>
//       (item.id === todo.id ? todo : item));
//     setTodos(newTodos);
//     setTodo({id: "-1", title: ""});
//   };
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