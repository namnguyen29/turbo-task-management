import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from '@repo/types/task';
import { of } from 'rxjs';

import { TaskApi } from '../../apis/task.api';
import { ModalService } from '../../shared/services/modal.service';
import { HomePage } from './home-page';

const tasks: Task[] = [
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
];

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: TaskApi, useValue: { getTasks: () => of(tasks) } },
        { provide: ModalService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the dashboard welcome message', () => {
    const message = fixture.nativeElement.querySelector('section > p') as HTMLParagraphElement;

    expect(message.textContent?.trim()).toBe('Welcome to your task management dashboard.');
  });

  it('renders the initial tasks and marks completed tasks', () => {
    const tasks = fixture.nativeElement.querySelectorAll('li') as NodeListOf<HTMLLIElement>;

    expect(Array.from(tasks, (task) => task.textContent?.trim())).toEqual([
      'Buy groceries',
      'Walk the dog',
    ]);
    expect(tasks[0].classList.contains('completed')).toBeFalse();
    expect(tasks[1].classList.contains('completed')).toBeTrue();
  });
});
