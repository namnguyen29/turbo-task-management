import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '@repo/types/task';

import { WelcomeModal } from './components/welcome-modal/welcome-modal';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-home-page',
  imports: [MatButtonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly modalService = inject(ModalService);
  public readonly tasks = signal<Task[]>([
    {
      id: '1',
      title: 'Buy groceries',
      completed: false,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '2',
      title: 'Walk the dog',
      completed: true,
      createdAt: '',
      updatedAt: '',
    },
  ]);

  public readonly modalResult = signal<string>('');

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
