import { Component, OnInit } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';
import { getRelativePosition } from 'chart.js/helpers';

import { ChartService } from './chart.service';

import { Province } from '../model/province';
import { Site } from '../model/site';
import { Driver } from '../model/driver';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  chart: any;
  counter = 0;
  hideChart = true;
  hideTimeOut = false;

  constructor(public service: ChartService) { }

  ngOnInit(): void {
    this.service.getDistanceByProvince()
      .subscribe(value => {
        if (value.length !== 0) {
          this.initChart(value)
          this.hideUI(false);
        }
      });
  }

  initChart(data: any[]) {
    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Total Distance Travelled by Province',
          data: data,
          backgroundColor: '#4bc0c0'
        }]
      },
      options: {
        parsing: {
          xAxisKey: 'provinceName',
          yAxisKey: 'totalDistanceTravelled'
        },
        onClick: (chartEvent) => this.onChartClick(chartEvent)
      }
    });
  }

  onChartClick(chartEvent: ChartEvent) {
    this.counter++;

    if (this.counter === 3)
      this.counter = 0;

    const canvasPosition = getRelativePosition(chartEvent, this.chart);
    const xIndex = this.chart.scales.x.getValueForPixel(canvasPosition.x);

    this.chart.data.datasets.forEach((dataset: any) => {
      const chart = dataset.data[xIndex];

      if (this.counter === 0) {
        this.service.getDistanceByProvince()
          .subscribe((value: Province[]) => {
            if (value.length !== 0)
              this.updateChart('Province', value, '#4bc0c0');
            else
              this.hideUI(true);
          });
      } else if (this.counter === 1) {
        this.service.getDistanceBySite(chart.provinceId)
          .subscribe((value: Site[]) => {
            if (value.length !== 0)
              this.updateChart('Site', value, '#ff9f40', chart.provinceName);
            else
              this.hideUI(true);
          });
      } else if (this.counter === 2) {
        this.service.getDistanceByDriver(chart.siteId)
          .subscribe((value: Driver[]) => {
            if (value.length !== 0)
              this.updateChart('Driver', value, '#9966ff', chart.siteName);
            else
              this.hideUI(true);
          });
      }
    });
  }

  updateChart(filterLevel: string, chartData: any[], backgroundColor: string, chartLabel = undefined) {
    this.chart.options.parsing.xAxisKey = filterLevel.toLowerCase() + 'Name';

    this.chart.data.datasets.forEach((dataset: any) => {
      let subFilter = (chartLabel) ? ': ' + chartLabel : '';
      dataset.label = 'Total Distance Travelled by ' + filterLevel + subFilter;
      dataset.data = chartData;
      dataset.backgroundColor = backgroundColor;
    });

    this.chart.update();
  }

  onBackClick() {
    this.counter = 0;

    this.service.getDistanceByProvince()
      .subscribe((value: Province[]) => {
        if (value.length !== 0)
          this.updateChart('Province', value, '#4bc0c0');
        else
          this.hideUI(true);
      });
  }

  hideUI(hide: boolean) {
    this.hideChart = hide;
    this.hideTimeOut = !hide;
  }
}