import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  todoList: any[] = [
    {
      id     : 1,
      title  : "Have to go to Gym tonight",
      date   : new Date(),
      status : "Active"
    },
  ]
  private lastId = 2;
  status : string = "All";
  

  constructor() { }
  addTodoInService(todo: string): void {
    console.log(this.todoList)
    // console.log(todo)
    this.todoList.push({
      id    : this.lastId++,
      title : todo,
      date  : new Date(),
      status : "Active"
    });
  }

  removeTodoInService(index: number): void {
    this.todoList.splice(index, 1);
  }

  editTodoInService(i: number, editedInput: string) {
    this.todoList[i].title = editedInput;
    this.todoList[i].date = new Date();
  }

  markAsCompleteInService(i:number): void {
    this.todoList[i].status = "Completed"
  }

  changeStatusInService(status : string): void{
    this.status  = status;
    console.log(this.status);
  }

  getAllTodos(): any[]{
    return this.todoList;
  }

  getCompletedTodos(): any[] {
    return this.todoList.filter(todo => todo.status === "Completed");
  }

  getPendingTodos(): any[] {
    return this.todoList.filter(todo => todo.status === "Active");
  }

}
