import {Component, OnInit,Input,ElementRef, ViewChild,OnChanges, SimpleChanges, SimpleChange,AfterViewChecked} from '@angular/core';
import {Chart} from 'chart.js';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.css']
})
export class ChartSummaryComponent implements OnInit,OnChanges,AfterViewChecked {

     @Input() heading: string;
     @Input() caption: string;
     @Input() disabled: boolean = false;
     @Input() data: any;
     @Input() display:boolean = false;


     ctx: any;
     PieChart: any;
     pieChart: HTMLCanvasElement;
     readyToDsplayChart:boolean = false;
     selected:any;

    constructor(private elRef: ElementRef) {

    }

    ngOnInit() {

    }

    ngAfterViewChecked(){
        if(this.readyToDsplayChart){
            this.displayChart();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property === 'data') {
                console.log('data changed');
                if(this.data){
                    this.display = true;
                    this.readyToDsplayChart = true;
                    this.selected = this.data[0];
                }
            }
        }
    }

    displayChart(){

        this.readyToDsplayChart = false;
        const elemRef: HTMLElement = this.elRef.nativeElement;
        this.pieChart = <HTMLCanvasElement> elemRef.getElementsByClassName('pieChart')[0];
        this.ctx = this.pieChart.getContext('2d');
        const labels: string[] = [];
        const data: number[] = [];

        for(let s of this.selected.summary){
            labels.push(s.name);
            data.push(s.value);
        }
        this.PieChart = new Chart(this.ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                label: '# of Votes',
                data: data,
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
