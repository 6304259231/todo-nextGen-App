import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { TodoService } from '../todo.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,  // Mark as standalone component
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule, MatFormField, MatLabel, MatInputModule,],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{

  constructor(private todoService : TodoService) {
    console.log("dashboard constructor");
  }
  
  todoInput: string = "";
  editInput: string = "";
  editIndex: number = -1;
  showEditBar: boolean = false;
  todoList: any[] = [];

  ngOnInit(){
    console.log("dashboard ngOnIt");
    this.todoList = this.todoService.getAllTodos(); // Fetch initial todos
    this.dataSource.data = this.todoList; // Update table data
  }


  // Data for the table
  displayedColumns: string[] = ['id', 'title', 'date', 'status', 'actions'];


  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.todoList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Method to add a todo
  addTodo(): void {
    if (this.todoInput.trim()) {
      this.todoService.addTodoInService(this.todoInput);
      this.todoList = this.todoService?.getAllTodos();
      this.dataSource.data = this.todoList; 
      this.dataSource.paginator = this.paginator;
      this.todoInput = ""; 
    }
    else {
      alert("please enter valid Task")
    }
  }

  // Method to edit a todo
  editTodo(): void {
    if (this.editInput.trim()) {
      this.todoService.editTodoInService(this.editIndex, this.editInput)
      this.dataSource.data = this.todoList; 
      this.cancelEdit();  // Reset the edit bar
    }
  }

  // Method to initiate editing a todo
  callEditTodo(i: number): void {
    this.showEditBar = true;
    this.editIndex = i;
    this.editInput = this.todoList[i].title;
  }

  // Method to cancel editing
  cancelEdit(): void {
    this.showEditBar = false;
    this.editIndex = -1;
    this.editInput = "";
  }

  // Method to remove a todo
  removeTodo(i: number): void {
    this.todoService.removeTodoInService(i);
    this.dataSource.data = this.todoList; // Update the table data
  }
  markCompleted(i : number) : void{
    this.todoService.markAsCompleteInService(i)
  }

}
