import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cell, CellType } from './types/cell.type';
import { WebSocketService } from './services/web-socket.service';
import { CommonModule } from '@angular/common';
import { AnalitcsSimulation } from './types/analitics.type';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AnalitcsComponent } from './components/analitcs/analitcs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSnackBarModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('cellContainer') cellContainer!: ElementRef;
  @ViewChildren('cellElement') cellElements!: QueryList<ElementRef>;
  cellList: Cell[] = [];
  analitcs!: AnalitcsSimulation;

  constructor(
    private webSocketService: WebSocketService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.handleCell();
  }

  handleCell(): void {
    this.webSocketService
      .on('cell')
      .subscribe(({ cell, behavior, analitcsSimulation }) => {
        if (behavior == 'division') {
          const existingCell = this.cellList.find((c) => c.name === cell.name);

          if (!existingCell) {
            this.cellList.push(cell);
            this.cdr.detectChanges();
            const lastCell =
              this.cellElements.toArray()[this.cellElements.length - 1];
            const height = this.cellContainer.nativeElement.offsetHeight;
            const width = this.cellContainer.nativeElement.offsetWidth;
            this.applyRandomAnimation(lastCell, height, width);
          }
        }

        if (behavior == 'repair') {
          const index = this.cellList.findIndex((c) => c.name === cell.name);
          this.cellList[index].cellType = cell.cellType;
          const cellElement = this.cellElements.toArray()[index];
          cellElement.nativeElement.style.backgroundColor = this.setCellColor(
            this.cellList[index].cellType
          );

          console.log(`${cell.name} realizou reparo`);
        }

        if (behavior == 'apoptose') {
          const index = this.cellList.findIndex((c) => c.name === cell.name);

          if (cell.cellType !== CellType.CancerousCell) {
            console.log(
              `${cell.name} realizou apoptose, tipo da celula: ${cell.cellType}`
            );
            this.cellList.splice(index, 1);
            this.cdr.detectChanges();
          }
        }

        if (behavior == 'finish') {
          this.analitcs = analitcsSimulation;

          console.log('Resultado da simulação:', this.analitcs);

          const snackbarRef = this.snackbar.open(
            'Simulação Finalizada!',
            undefined,
            {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            }
          );

          snackbarRef.afterDismissed().subscribe(() => {
            const dialogRef = this.dialog.open(AnalitcsComponent, {
              width: '500px',
              height: '400px',
              data: this.analitcs,
            });

            dialogRef.afterClosed().subscribe(() => {
              this.cellList = [];

              this.snackbar.open(
                'Sistema pronto para uma nova simulação!',
                undefined,
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 4000,
                }
              );

              this.cdr.detectChanges();
            });
          });
        }
      });
  }

  setCellColor(cellType: CellType) {
    const cellTypes = new Map();
    cellTypes.set(CellType.NormalCell, 'red');
    cellTypes.set(CellType.DamagedCell, 'orange');
    cellTypes.set(CellType.PreCancerousCell, 'greenyellow');
    cellTypes.set(CellType.CancerousCell, 'green');

    return cellTypes.get(cellType);
  }

  private applyRandomAnimation(
    cell: ElementRef,
    containerHeight: number,
    containerWidth: number
  ): void {
    const animationName = `randomMove${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const keyframes = `
      @keyframes ${animationName} {
        0% {
          transform: translate(0, 0);
        }
        25% {
          transform: translate(${this.getRandomPosition(
            containerWidth
          )}px, ${this.getRandomPosition(containerHeight)}px);
        }
        50% {
          transform: translate(${this.getRandomPosition(
            containerWidth
          )}px, ${this.getRandomPosition(containerHeight)}px);
        }
        75% {
          transform: translate(${this.getRandomPosition(
            containerWidth
          )}px, ${this.getRandomPosition(containerHeight)}px);
        }
        100% {
          transform: translate(0, 0);
        }
      }
    `;

    const styleTag = document.createElement('style');
    styleTag.innerHTML = keyframes;
    document.head.appendChild(styleTag);

    this.renderer.setStyle(
      cell.nativeElement,
      'animation',
      `${animationName} 20s infinite`
    );
  }

  private getRandomPosition(limit: number): number {
    return Math.random() * limit - limit / 2;
  }
}
