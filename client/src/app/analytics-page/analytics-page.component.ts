import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subscription} from "rxjs";
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  average: number
  pending = true
  aSub: Subscription

  constructor(private service: AnalyticsService) {
  }

  ngAfterViewInit(): void {

    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(130.99.32)'

    }
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(130.99.32)'

    }

    this.aSub = this.service.getAnalytics().subscribe(
      (data: AnalyticsPage) => {
        this.average = data.average

        gainConfig.labels = data.chart.map(item => item.label)
        gainConfig.data = data.chart.map(item => item.gain)
        orderConfig.labels = data.chart.map(item => item.label)
        orderConfig.data = data.chart.map(item => item.order)

        const gainCtx = this.gainRef.nativeElement.getContext('2d')
        const orderCtx = this.orderRef.nativeElement.getContext('2d')
        gainCtx.canvas.height = '300px'
        orderCtx.canvas.height = '300px'

        // @ts-ignore
        new Chart(gainCtx,createChartConfig(gainConfig))
        // @ts-ignore
        new Chart(orderCtx,createChartConfig(orderConfig))

        this.pending = false
      }
    )
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}


// @ts-ignore
function createChartConfig({labels, data, label, color}){
  return{
    type: 'line',
    options: {
      responsive: true
    },
    data:{
      labels,
      datasets:[
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false

        }
      ]
    }
  }
}
