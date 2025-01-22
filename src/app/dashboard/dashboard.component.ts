import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TodoService } from '../todo.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SpinnerComponent } from '../util/spinner/spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,  // Mark as standalone component
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule, MatFormField, MatLabel, MatInputModule, MatSortModule, SpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl : './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private todoService: TodoService, private toastr: ToastrService, private router: Router, private _liveAnnouncer: LiveAnnouncer) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  todoInput: string = "";
  editInput: string = "";
  editIndex: number = -1;
  showEditBar: boolean = false;
  todoList: any[] = [];
  userId: any;
  isDataLoadingByApi : boolean = false;
  searchedInput : string = '';
  filteredTodos : any[] = [];
  noResultsFound : boolean = false;

  ngOnInit() {
    this.userId = this.todoService.getCurrentUserIdFromStorage();
    if (this.userId) {
        this.todoService.isLoadingDataSubject.subscribe((data) => {
        this.isDataLoadingByApi = data;
      });
  
      this.todoService.getAllTodos(this.userId).subscribe({
        next: (data) => {
          if (data) {
            this.todoList = data[0].todos.todo;
            this.dataSource.data = this.todoList; // Update dataSource with filtered todos
          }
        },
        error: (error) => {
          this.toastr.warning('Server Error please try again after some time', 'Warning');
          console.log('Error Fetching data', error);
        },
      });
    } else {
      // this.toastr.warning("Please regsiter to this application to unlock !" , "Warning")
      this.router.navigateByUrl('/login');
    }
  }
  

  // Data for the table
  displayedColumns: string[] = ['id', 'title', 'date', 'status', 'actions'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.todoList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  filterTodo() {
    console.log("filter method called")
    if (this.searchedInput) {
      this.filteredTodos =  this.todoList.filter((todo) => todo.title.toLowerCase().includes(this.searchedInput.toLowerCase()));
      if (this.filteredTodos.length === 0) {
        this.noResultsFound = true;
      } else {
        this.noResultsFound = false;
      }

      this.dataSource.data = this.filteredTodos;
    } else if(!this.searchedInput || this.searchedInput == '') {
      this.noResultsFound = false;
      console.log(this.searchedInput);
      this.dataSource.data = this.todoList;
    }
  }
  
  // Method to add a todo
  addTodo(): void {
   if(this.userId){
    this.todoService.addTodoApi(this.userId, this.todoInput).subscribe({
      next: (data) => {
        if (data) {
          this.todoList = data?.todos?.todo;
          this.dataSource.data = this.todoList;
          this.toastr.success("Task added successfully!", "Success");
          this.dataSource.paginator = this.paginator;
          this.todoInput = "";
        }
      },
      error: (error) => {
        this.toastr.warning("Server Error!", "Warning");
        console.log("Error Fecthing data", error)
      }
    })
   }
  }

  // Method to edit a todo
  editTodo(): void {
    if(this.userId){
      this.todoService.editTodoApi(this.userId, this.editIndex, this.editInput).subscribe({
        next: (data) => {
          if (data) {
            console.log(data)
            this.todoList = data?.getEditedTodos[0]?.todos?.todo || [];
            this.dataSource.data = this.todoList;
            this.toastr.success("Task edited successfully!", "Success");
            this.cancelEdit();
          }
        },
        error: (error) => {
          this.toastr.warning("Server Error!", "Warning")
          console.log("Error Fecthing data", error);
        }
      })
    }
  }
  callEditTodo(id: any, title: any): void {
    this.showEditBar = true;
    this.editIndex = id;
    this.editInput = title;
  }

  // Method to cancel editing
  cancelEdit(): void {
    this.showEditBar = false;
    this.editIndex = -1;
    this.editInput = "";
  }

  // Method to remove a todo
  removeTodo(todoId: string): void {
    this.todoService.removeTodoApi(this.userId, todoId).subscribe({
      next: (data) => {
        if (data) {
          this.todoList = data.getUpadtedTodos[0].todos?.todo;
          this.dataSource.data = this.todoList;
          this.toastr.success("Task deleted successfully!", "Success");
          this.dataSource.paginator = this.paginator;

        }
      },
      error: (error) => {
        this.toastr.warning("Server Error!", "Warning")
        console.log("Error Fecthing data", error)
      }
    })
  }

  markAsCompleted(todoId: number): void {
    this.todoService.markAsCompleted(this.userId, todoId).subscribe({
      next: (data) => {
        if (data) {
          console.log(data)
          this.todoList = data?.getEditedTodos[0]?.todos?.todo || [];
          this.dataSource.data = this.todoList;
          this.toastr.success("Task completed successfully!", "Success")
        }
      },
      error: (error) => {
        this.toastr.warning("Server Error!", "Warning")
        console.log("Error Fecthing data", error)
      }
    })
  }
  
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
