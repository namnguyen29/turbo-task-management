import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DestroyRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, startWith } from 'rxjs';
import type { Task } from '@repo/models/task.model';

@Component({
  selector: 'app-main-layout',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public readonly isHandset = signal(false);
  public readonly pageTitle = signal('Task Management');
  public readonly sidebarOpen = signal(true);
  public readonly task = signal<Task>({
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    completed: false,
    createdAt: '2022-01-01',
    updatedAt: '2022-01-01',
  });

  constructor() {
    console.log(this.task());

    this.breakpointObserver
      .observe('(max-width: 767px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => {
        this.isHandset.set(matches);
        this.sidebarOpen.set(!matches);
      });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.pageTitle.set(this.getPageTitle()));
  }

  public toggleSidebar(): void {
    this.sidebarOpen.update((isOpen) => !isOpen);
  }

  public closeSidebarOnHandset(): void {
    if (this.isHandset()) {
      this.sidebarOpen.set(false);
    }
  }

  private getPageTitle(): string {
    let route = this.router.routerState.snapshot.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.title ?? 'Task Management';
  }
}
