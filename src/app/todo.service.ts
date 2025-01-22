import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


export class TodoService {

  constructor(private http: HttpClient ) {}
 
  private apiURI = "https://todo-nextgen-server-2.onrender.com";
  todoList: any[] = [];
  authStatusSubject = new BehaviorSubject<boolean>(this.checkUserAuth());

  isLoadingDataSubject = new BehaviorSubject<boolean>(false); 
 

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  checkUserAuth() : boolean {
    if(this.isBrowser()){
      let isUserAuth = localStorage.getItem('isUserAuth');
      return isUserAuth === 'true';
    }
    return false;
  }


  getCurrentUserIdFromStorage(): string | null {
    // Ensure code runs only in browser context
    if (typeof window !== 'undefined' && localStorage) {       
      return localStorage.getItem("currentUserId");
    }
    return null;
  }
  
  removeCurrentUserIdFromStorage(): void {
    // Ensure code runs only in browser context
    if (typeof window !== 'undefined' && localStorage) {       
      localStorage.removeItem("currentUserId");
      localStorage.removeItem('isUserAuth');
    }
    this.authStatusSubject.next(false);  // Reset authentication status
  }
  
  setCurrentUserIdInStorage(userId: string): void {
    if (typeof window !== 'undefined' && localStorage) {       
      localStorage.setItem('currentUserId', userId);
      localStorage.setItem('isUserAuth', 'true');
      this.authStatusSubject.next(true);   // Update authentication status
    }
    
  }

  registerNewUser(userDetails : any): Observable<any>{
    return this.http.post(`${this.apiURI}/register`, userDetails)
  }

  
  loginUser(userDetails : any): Observable<any>{
    return this.http.post(`${this.apiURI}/login`, userDetails)
  }

  getCurrentUser(currentUserId : any): Observable<any> {
    return this.http.get(`${this.apiURI}/get-current-user/${currentUserId}`)
  }

  addTodoApi(userId : any, todo: any): Observable<any> {
   return this.http.post(`${this.apiURI}/post-todo/${userId}`, { "title" : todo})
  }

  removeTodoApi( userId: string, todoId: string):  Observable<any> {
    return this.http.delete(`${this.apiURI}/delete-todo/${userId}/${todoId}`,)
  }

  editTodoApi( userId : any, editIndex : any, editedInput: string) : Observable<any> {
    return this.http.put(`${this.apiURI}/edit-todo/${userId}/${editIndex}`, { title : editedInput})
  }

  markAsCompleted( userId : any, todoId : any ): Observable<any>  {
    return this.http.put(`${this.apiURI}/edit-todo/${userId}/${todoId}/Completed`, { status : "Completed"})
  }

  getAllTodos(userId: any): Observable<any> {
    this.isLoadingDataSubject.next(true);
    return this.http.get(`${this.apiURI}/get-todos/${userId}`).pipe(
      finalize(() => {
        this.isLoadingDataSubject.next(false)
      })
    );
  }
  
  getCompletedTodos(userId: any): Observable<any> {
    this.isLoadingDataSubject.next(true);
    return this.http.get(`${this.apiURI}/todos/completed/${userId}`).pipe(
      finalize(() => {
        this.isLoadingDataSubject.next(false)
      })
    );
  }
  
  getPendingTodos(userId: any): Observable<any> {
    this.isLoadingDataSubject.next(true);
    return this.http.get(`${this.apiURI}/todos/pending/${userId}`).pipe(
      finalize(() => {
        this.isLoadingDataSubject.next(false)
      })
    );
  }

  deleteCurrentUser(userId : any) : Observable<any> {
    this.isLoadingDataSubject.next(true);
    return this.http.delete(`${this.apiURI}/deleteUser/${userId}`).pipe(
      finalize(() => {
        this.isLoadingDataSubject.next(false)
      })
    );
  }

}
