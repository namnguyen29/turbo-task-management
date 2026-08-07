import { Component, signal } from '@angular/core';
import { Task } from '@repo/types/task';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
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
}
