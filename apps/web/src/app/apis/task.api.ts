import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateTaskInput, Task, UpdateTaskInput } from '@repo/types/task';
import { Observable } from 'rxjs';
import { ENV_CONFIG } from '../../environments/environment.config';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENV_CONFIG);
  private readonly tasksUrl = `${this.env.apiUrl}/tasks`;

  public getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl);
  }

  public createTask(input: CreateTaskInput): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, input);
  }

  public updateTask(id: string, input: UpdateTaskInput): Observable<Task> {
    return this.http.patch<Task>(`${this.tasksUrl}/${id}`, input);
  }

  public deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.tasksUrl}/${id}`);
  }
}
