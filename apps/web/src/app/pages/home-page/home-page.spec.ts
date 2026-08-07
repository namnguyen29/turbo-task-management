import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home-page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
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

    expect(Array.from(tasks, (task) => task.textContent?.trim())).toEqual(['Buy groceries', 'Walk the dog']);
    expect(tasks[0].classList.contains('completed')).toBeFalse();
    expect(tasks[1].classList.contains('completed')).toBeTrue();
  });
});
