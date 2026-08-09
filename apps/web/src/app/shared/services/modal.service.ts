import { ComponentType } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(MatDialog);

  public open<T, D = unknown, R = unknown>(
    component: ComponentType<T>,
    config?: MatDialogConfig<D>,
  ): MatDialogRef<T, R> {
    return this.dialog.open(component, config);
  }

  public closeAll(): void {
    this.dialog.closeAll();
  }
}
