import { Component, Inject, OnDestroy } from '@angular/core';
import { CellService } from '../../services/cell.service';
import { AnalitcsSimulation } from '../../types/analitics.type';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GraphComponent } from '../graph/graph.component';

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
    private cellService: CellService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.cellService.prepareForNewSimulation().subscribe(() => {
      console.log('Sistema pronto para uma nova simulação...');
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openGraphDialog() {
    this.dialog.open(GraphComponent, {
      width: '900px',
      height: '700px',
      data: this.data,
    });
  }
}
