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
     BarChart: any;
     pieChart: HTMLCanvasElement;
     barChart: HTMLCanvasElement;
     readyToDisplayReportsChart:boolean = false;
     readyToDisplayDisbursementsChart:boolean = false;
     selected:any;

    constructor(private elRef: ElementRef) {

    }

    ngOnInit() {

    }

    ngAfterViewChecked(){
        if(this.readyToDisplayReportsChart){
            this.displayReportsChart();
        }else if(this.readyToDisplayDisbursementsChart){
            this.displayDisbursementsChart();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property === 'data') {
                console.log('data changed');
                if(this.data){
                    this.display = true;
                    this.readyToDisplayReportsChart = true;
                    this.selected = this.data[0];
                }
            }
        }
    }

    displayReportsChart(){

        this.readyToDisplayReportsChart = false;
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
                            },
                            formatter: function(value, context) {
                                if(Number(value)>0){
                                    return value;
                                }else{
                                    return '';
                                }
                            }
                        }
                    }
            }
        });
    }

    displayDisbursementsChart(){
        this.readyToDisplayDisbursementsChart = false;
        const elemRef: HTMLElement = this.elRef.nativeElement;
        this.barChart = <HTMLCanvasElement> elemRef.getElementsByClassName('barChart')[0];
        this.ctx = this.barChart.getContext('2d');
        const labels: string[] = [];
        const dataCommitted: any[] = [];
        const dataDisbursed: any[] = [];
        let maxTick = 0;

        for(let s of this.selected.summary){
            labels.push(s.name);

            for(let v of s.values){
                if(v.name==='Committed'){
                    dataCommitted.push(v.value);
                }
                if(v.name==='Disbursed'){
                    dataDisbursed.push(v.value);
                }
                if(Number(v.value)>maxTick){
                    maxTick = Number(v.value);
                }
            }
        }
        this.BarChart = new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                  label: 'Grant Level Commitment',
                  data: dataCommitted,
                  backgroundColor: "#4D83C2"
                }, {
                  label: 'Disbursed for the period',
                  data: dataDisbursed,
                  backgroundColor: "#39743C"
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
                            color: 'black',
                            font: {
                                weight: 'bold'
                            },
                            anchor:'end',
                            align:'top',
                            offset:10
                        }
                    },
                    scales:{
                        yAxes:[
                            {
                            scaleLabel: {
                                   display: true,
                                   labelString: "In Lakhs (₹)",
                            },
                            ticks:{
                                    min: 0,
                                    max: (Math.ceil(maxTick/50)*50)+500,
                                    stepSize: 500
                            }
                        }],
                        xAxes:[
                            {
                            scaleLabel: {
                                   display: true,
                                   labelString: "Financial Periods",
                            }
                        }]
                    }
            }
        });
        this.BarChart.generateLegend();
    }


    doSomething(ev:any){
        for(let i=0;i<this.data.length;i++){
            if(this.data[i].name===ev.value){
                if(ev.value==='Reports'){
                    this.readyToDisplayReportsChart = true;
                    this.readyToDisplayDisbursementsChart = false;
                } else if(ev.value==='Disbursements'){
                    this.readyToDisplayReportsChart = false;
                    this.readyToDisplayDisbursementsChart = true;
                }
                this.selected = this.data[i];
                return;
            }
        }
    }

}
