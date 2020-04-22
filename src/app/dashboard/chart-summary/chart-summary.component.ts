import {Component, OnInit,Input,ElementRef, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.css']
})
export class ChartSummaryComponent implements OnInit {

     @Input() heading: string;
     @Input() caption: string;
     @Input() disabled: boolean = false;

     ctx: any;
     PieChart: any;

     @ViewChild('pieChart') pieChart: ElementRef;

    constructor() {

    }

    ngOnInit() {

        this.ctx = this.pieChart.nativeElement.getContext('2d');

        this.PieChart = new Chart(this.ctx, {
            type: 'doughnut',
            data: {
                labels: ["Approved Reports", "Unapproved Reports", "Due Reports", "Overdue Reports"],
                datasets: [{
                label: '# of Votes',
                data: [20,3 , 2, 5],
                    backgroundColor: [
                        '#4DC252',
                        '#4D83C2',
                        '#E6CE55',
                        '#E04545'
                    ]
                }]
            },
            options: {
                    legend:{
                        display: true,
                        position: 'right',
                        align: 'center'
                    },
                    tooltips:{
                        enabled: false
                    },
                    plugins:{
                        datalabels:{
                            color: 'white',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
            }
        });
    }

}
