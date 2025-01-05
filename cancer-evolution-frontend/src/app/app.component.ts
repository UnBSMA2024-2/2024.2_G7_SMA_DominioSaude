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
import { Cell } from './types/cell.type';
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
      }

      if (behavior == 'apoptose') {
        const index = this.cellList.findIndex((c) => c.name === cell.name);
        const apoptoseElement = this.cellElements.toArray()[index];

        this.applyApoptoseAnimation(apoptoseElement);
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

  setCellColor(cellType: string) {
    const cellTypes = new Map();
    cellTypes.set('NormalCell', 'red');
    cellTypes.set('DamagedCell', 'orange');
    cellTypes.set('PreCancerousCell', 'greenyellow');
    cellTypes.set('CancerousCell', 'green');

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

  applyApoptoseAnimation(cell: ElementRef): void {
    // Define a animação de crescimento
    const apoptoseAnimation = `
      @keyframes explode {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.5);
          opacity: 0.5;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    `;

    // Adiciona a animação ao estilo global
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(apoptoseAnimation, styleSheet.cssRules.length);

    // Recupera as animações atuais aplicadas ao elemento
    const currentAnimations =
      getComputedStyle(cell.nativeElement).animation || '';

    // Adiciona a nova animação sem remover as anteriores
    const animationName = 'explode';
    const newAnimation = `${animationName} 2s ease-in-out`;
    const combinedAnimations = currentAnimations
      ? `${currentAnimations}, ${newAnimation}`
      : newAnimation;

    // Aplica todas as animações ao elemento
    this.renderer.setStyle(cell.nativeElement, 'animation', combinedAnimations);
  }
}
