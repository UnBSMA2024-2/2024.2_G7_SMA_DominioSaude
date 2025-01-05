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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('cellContainer') cellContainer!: ElementRef;
  @ViewChildren('cellElement') cellElements!: QueryList<ElementRef>;
  cellList: Cell[] = [];

  constructor(
    private webSocketService: WebSocketService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.handleCell();
  }

  handleCell(): void {
    this.webSocketService.on('cell').subscribe(({ cell, behavior }) => {
      if (behavior == 'repair') {
        const index = this.cellList.findIndex((c) => c.name === cell.name);
        this.cellList[index].cellType = cell.cellType;
        const cellElement = this.cellElements.toArray()[index];
        cellElement.nativeElement.style.backgroundColor = this.setCellColor(
          this.cellList[index].cellType
        );

        console.log(`${cell} realizou reparo`);
      }

      if (behavior == 'apoptose') {
        const index = this.cellList.findIndex((c) => c.name === cell.name);

        console.log(`${cell} realizou apoptose`);

        this.cellList.splice(index, 1);
        this.cdr.detectChanges();
      }

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
    const randomKeyframes: any = `
      @keyframes randomMove${Math.random().toString(36).substr(2, 9)} {
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

    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(randomKeyframes, styleSheet.cssRules.length);

    const animationName = randomKeyframes.match(/@keyframes (.*) {/)[1];
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
