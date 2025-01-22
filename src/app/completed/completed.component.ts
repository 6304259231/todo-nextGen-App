import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TodoService } from '../todo.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../util/spinner/spinner.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css'],
  imports: [MatTableModule, MatSortModule, CommonModule, MatPaginatorModule, CommonModule, FormsModule , SpinnerComponent]
})
export class CompletedComponent implements AfterViewInit {
  completedTodos: any[] = [];
  displayedColumns: string[] = ['id', 'title', 'date', 'status'];
  dataSource = new MatTableDataSource<any>(this.completedTodos);
  userId: any;
  searchedInput : string = '';
  filteredTodos : any[] = [];
  noResultsFound : boolean = false;
  isDataLoadingByApi : boolean = false;

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private todoService: TodoService, private _liveAnnouncer: LiveAnnouncer, private router : Router) {  }

  ngOnInit() {
    this.userId = this.todoService.getCurrentUserIdFromStorage();
    if(this.userId){
      this.dataSource.paginator = this.paginator;
      this.todoService.isLoadingDataSubject.subscribe((data) => {
        this.isDataLoadingByApi = data;
      });
      this.fetchCompletedTodos();
    }else {
      this.router.navigateByUrl('/login');
    }
  }

  fetchCompletedTodos() {
    this.todoService.getCompletedTodos(this.userId).subscribe({
      next: (data) => {
        this.completedTodos = data.completedTodos;
        this.dataSource.data = this.completedTodos;
      },
      error: (error) => {
        console.log("Error Fecthing data", error)
      }
    })
  }

  filterTodo() {
    console.log("filter method called")
    if (this.searchedInput) {
      this.filteredTodos =  this.completedTodos.filter((todo) => todo.title.toLowerCase().includes(this.searchedInput.toLowerCase()));
      if (this.filteredTodos.length === 0) {
        this.noResultsFound = true;
      } else {
        this.noResultsFound = false;
      }

      this.dataSource.data = this.filteredTodos;
    } else if(!this.searchedInput || this.searchedInput == '') {
      this.noResultsFound = false;
      console.log(this.searchedInput);
      this.dataSource.data = this.completedTodos;
    }
  }
  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
