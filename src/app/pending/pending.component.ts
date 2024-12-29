import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TodoService } from '../todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending',
  imports: [MatTableModule, MatSortModule, CommonModule],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent {
  pendingTodos: any[] = [];
  displayedColumns: string[] = ['id', 'title', 'date', 'status'];
  dataSource = new MatTableDataSource<any>(this.pendingTodos);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private todoService: TodoService, private _liveAnnouncer: LiveAnnouncer) {
    this.fetchCompletedTodos();
    console.log("pending constructor");
  }

  fetchCompletedTodos() {
    this.pendingTodos = this.todoService.getPendingTodos();
    this.dataSource = new MatTableDataSource(this.pendingTodos);
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
