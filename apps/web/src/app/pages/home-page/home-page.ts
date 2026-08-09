import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '@repo/types/task';

import { TaskApi } from '../../apis/task.api';
import { WelcomeModal } from './components/welcome-modal/welcome-modal';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-home-page',
  imports: [MatButtonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  private readonly modalService = inject(ModalService);
  private readonly taskApi = inject(TaskApi);
  public readonly tasks = signal<Task[]>([]);
  public readonly isLoadingTasks = signal(true);
  public readonly tasksError = signal<string | null>(null);
  public readonly modalResult = signal<string>('');

  ngOnInit(): void {
    this.loadTasks();
  }

  public loadTasks(): void {
    this.isLoadingTasks.set(true);
    this.tasksError.set(null);

    this.taskApi.getTasks().subscribe({
      next: (tasks) => this.tasks.set(tasks),
      error: () => {
        this.tasksError.set('Unable to load tasks. Please try again.');
        this.isLoadingTasks.set(false);
      },
      complete: () => this.isLoadingTasks.set(false),
    });
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
