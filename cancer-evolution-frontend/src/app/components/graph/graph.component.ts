import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { AnalitcsSimulation } from '../../types/analitics.type';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective, MatButtonModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  providers: [provideEcharts()],
})
export class GraphComponent implements AfterViewInit {
  chartOption!: EChartsOption;

  constructor(
    public dialogRef: MatDialogRef<GraphComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AnalitcsSimulation,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: ['Normal', 'Danificada', 'Pré-Cancerigena', 'Cancerigena'],
        axisLabel: {
          rotate: 0,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Porcentagem (mil)',
          type: 'bar',
          data: [
            this.convertToNumber(this.data.normalPercentage),
            this.convertToNumber(this.data.damagedPercentage),
            this.convertToNumber(this.data.preCancerousPercentage),
            this.convertToNumber(this.data.cancerousPercentage),
          ],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
          },
          itemStyle: {
            color: (params: any) => {
              const colors = [' #FF0000', '#FFA500', '#ADFF2E', '#018000'];
              return colors[params.dataIndex];
            },
          },
        },
      ],
    };

    // this.cdr.detectChanges();
  }

  convertToNumber(percentage: string) {
    return parseFloat(percentage.replace('%', '').replace(',', '.'));
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
