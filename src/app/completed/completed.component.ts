import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TodoService } from '../todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css'],
  imports: [MatTableModule, MatSortModule, CommonModule]
})
export class CompletedComponent implements AfterViewInit {
  completedTodos: any[] = [];
  displayedColumns: string[] = ['id', 'title', 'date', 'status'];
  dataSource = new MatTableDataSource<any>(this.completedTodos);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private todoService: TodoService, private _liveAnnouncer: LiveAnnouncer) {
    this.fetchCompletedTodos();
    console.log("completed constructor");
  }

  fetchCompletedTodos() {
    this.completedTodos = this.todoService.getCompletedTodos();
    this.dataSource = new MatTableDataSource(this.completedTodos);
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
