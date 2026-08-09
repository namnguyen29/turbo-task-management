import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface WelcomeModalData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-welcome-modal',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './welcome-modal.html',
  styleUrl: './welcome-modal.scss',
})
export class WelcomeModal {
  public readonly data = inject<WelcomeModalData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<WelcomeModal, boolean>);

  public close(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}
