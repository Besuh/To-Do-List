import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { NgForm } from '@angular/forms';
import { TodoServiceService } from '../todo-service.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[];
  newTodo: Todo = new Todo();
  editing: boolean = false;
  editingTodo: Todo = new Todo();

  constructor(private todoService: TodoServiceService) { }

  ngOnInit() {
    this.getTodos();
  }

  getTodos() {
    this.todoService.getTodos()
      .then(todos => this.todos = todos);
  }

  createTodo(todoForm: NgForm) { 
    this.todoService.createTodo(this.newTodo)
      .then(createTodo => {
        todoForm.reset();
        this.newTodo = new Todo();
        this.todos.unshift(createTodo)
      });
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id)
      .then(() => {
        this.todos = this.todos.filter(todo=> todo.id != id);
      });
  }

  updateTodo(todoData: Todo) {
    console.log(todoData);
    this.todoService.updateTodo(todoData)
      .then(updatedTodo => {
        let existingTodo = this.todos.find(todo => todo.id === updatedTodo.id);
        Object.assign(existingTodo, updatedTodo);
        this.clearEditing();
      });
  }

  toggleCompleted(todoData: Todo) {
    todoData.completed = !todoData.completed;
    this.todoService.updateTodo(todoData)
      .then(updatedTodo => {
        let existingTodo = this.todos.find(todo => todo.id === updatedTodo.id);
        Object.assign(existingTodo, updatedTodo);
      })
  }

  editTodo(todoData: Todo) {
    this.editing = true;
    Object.assign(this.editingTodo, todoData);
  }

  clearEditing() {
    this.editingTodo = new Todo();
    this.editing = false;
  }
}
