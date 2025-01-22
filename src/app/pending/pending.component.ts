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
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-pending',
  imports: [MatTableModule, MatSortModule, CommonModule, MatPaginatorModule, FormsModule, SpinnerComponent],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent {
  [x: string]: any;
  pendingTodos: any[] = [];
  displayedColumns: string[] = ['id', 'title', 'date', 'status'];
  dataSource = new MatTableDataSource<any>(this.pendingTodos);
  userId: any;
  searchedInput : string = '';
  filteredTodos : any[] = [];
  noResultsFound : boolean = false;
  isDataLoadingByApi : boolean = false;

  @ViewChild(MatSort) sort!: MatSort;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private todoService: TodoService, private _liveAnnouncer: LiveAnnouncer, private router : Router, private toastr : ToastrService) {
  }

  ngOnInit() {
    this.userId = this.todoService.getCurrentUserIdFromStorage();
    if(this.userId){
      this.dataSource.paginator = this.paginator;
      this.todoService.isLoadingDataSubject.subscribe((data) => {
        this.isDataLoadingByApi = data;
      });
      this.fetchPendingTodos();
    }else {
      this.toastr.warning("Please regsiter / Login to this App to unlock more faeutures" , "Warning");
      this.router.navigateByUrl('/login');
    }
  }

  
  filterTodo() {
    console.log("filter method called")
    if (this.searchedInput) {
      this.filteredTodos =  this.pendingTodos.filter((todo) => todo.title.toLowerCase().includes(this.searchedInput.toLowerCase()));
      if (this.filteredTodos.length === 0) {
        this.noResultsFound = true;
      } else {
        this.noResultsFound = false;
      }

      this.dataSource.data = this.filteredTodos;
    } else if(!this.searchedInput || this.searchedInput == '') {
      this.noResultsFound = false;
      console.log(this.searchedInput);
      this.dataSource.data = this.pendingTodos;
    }
  }

  fetchPendingTodos() {
    this.todoService.getPendingTodos(this.userId).subscribe({
      next: (data) => {
        this.pendingTodos = data.pendingTodos;
        this.dataSource.data = this.pendingTodos;
      },
      error: (error) => {
        console.log("Error Fecthing data", error)
      }
    })
  }

  ngAfterViewInit() {
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
