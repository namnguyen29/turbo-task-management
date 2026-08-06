import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';

import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  let breakpointChanges: Subject<BreakpointState>;
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;

  beforeEach(async () => {
    breakpointChanges = new Subject<BreakpointState>();
    const breakpointObserver = jasmine.createSpyObj<BreakpointObserver>('BreakpointObserver', ['observe']);
    breakpointObserver.observe.and.returnValue(breakpointChanges);

    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [provideRouter([]), { provide: BreakpointObserver, useValue: breakpointObserver }],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates with the desktop layout open', () => {
    expect(component).toBeTruthy();
    expect(component.isHandset()).toBeFalse();
    expect(component.sidebarOpen()).toBeTrue();
    expect(component.pageTitle()).toBe('Task Management');
  });

  it('closes the sidebar when the viewport becomes a handset', () => {
    breakpointChanges.next({ matches: true, breakpoints: {} });

    expect(component.isHandset()).toBeTrue();
    expect(component.sidebarOpen()).toBeFalse();
  });

  it('opens the sidebar again when the viewport returns to desktop', () => {
    breakpointChanges.next({ matches: true, breakpoints: {} });
    breakpointChanges.next({ matches: false, breakpoints: {} });

    expect(component.isHandset()).toBeFalse();
    expect(component.sidebarOpen()).toBeTrue();
  });

  it('toggles and closes the sidebar through its public actions', () => {
    component.toggleSidebar();
    expect(component.sidebarOpen()).toBeFalse();

    component.isHandset.set(true);
    component.closeSidebarOnHandset();

    expect(component.sidebarOpen()).toBeFalse();
  });
});
