import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CellService } from '../../services/cell.service';
import { AnalitcsSimulation } from '../../types/analitics.type';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-analitcs',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './analitcs.component.html',
  styleUrl: './analitcs.component.scss',
})
export class AnalitcsComponent implements OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AnalitcsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AnalitcsSimulation,
    private cellService: CellService
  ) {}

  ngOnDestroy(): void {
    this.cellService.prepareForNewSimulation().subscribe(() => {
      console.log('Sistema pronto para uma nova simulação...');
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
