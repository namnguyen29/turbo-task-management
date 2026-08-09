import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { Task } from '@repo/types/task';

import { catchError, Observable, of } from 'rxjs';

import { TaskApi } from '../../apis/task.api';
import { WelcomeModal } from './components/welcome-modal/welcome-modal';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-home-page',
  imports: [MatButtonModule, AsyncPipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  private readonly modalService = inject(ModalService);
  private readonly taskApi = inject(TaskApi);
  public readonly tasksError = signal<string | null>(null);
  public readonly modalResult = signal<string>('');
  public tasks$!: Observable<Task[]>;

  public ngOnInit(): void {
    this.loadTasks();
  }

  public loadTasks(): void {
    this.tasks$ = this.taskApi.getTasks().pipe(
      catchError((error) => {
        console.error('Error loading tasks:', error);
        this.tasksError.set('Unable to load tasks. Please try again.');
        return of([]);
      }),
    );
  }

  public openWelcomeModal(): void {
    this.modalService
      .open(WelcomeModal, {
        data: {
          title: 'Ready to manage your tasks?',
          message: 'This dialog was opened through the shared ModalService.',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        this.modalResult.set(confirmed ? 'You chose Continue.' : 'You closed the dialog.');
      });
  }
}
