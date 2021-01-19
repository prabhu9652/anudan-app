import { Colors } from './../../model/app-config';
import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, SimpleChange, AfterViewChecked } from '@angular/core';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
    selector: 'app-chart-summary',
    templateUrl: './chart-summary.component.html',
    styleUrls: ['./chart-summary.component.css']
})
export class ChartSummaryComponent implements OnInit, OnChanges, AfterViewChecked {

    @Input() heading: string;
    @Input() caption: string;
    @Input() disabled: boolean = false;
    @Input() data: any;
    @Input() display: boolean = false;
    @Input() portfolioType: any;

    ctx: any;
    PieChart1: any;
    PieChartX: any;
    PieChart2: any;
    BarChart: any;
    pieChart1: HTMLCanvasElement;
    pieChartX: HTMLCanvasElement;
    pieChart2: HTMLCanvasElement;
    barChart: HTMLCanvasElement;
    readyToDisplayReportsChart: boolean = false;
    readyToDisplayDisbursementsChart: boolean = false;
    selected: any;
    grantState: string;
    draftReportsCount: number = 0;
    inprogressReportsCount: number = 0;
    approvedReportsCount: number = 0;

    constructor(private elRef: ElementRef) {

    }

    ngOnInit() {
        Chart.plugins.unregister(ChartDataLabels);
    }

    ngAfterViewChecked() {
        if (this.readyToDisplayReportsChart) {
            this.displayReportsChart();
        } else if (this.readyToDisplayDisbursementsChart) {
            this.displayDisbursementsChart();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property === 'data') {
                console.log('data changed');
                if (this.data) {
                    this.display = true;
                    if (this.data && this.portfolioType) {
                        this.readyToDisplayReportsChart = true;
                    }
                    this.selected = this.data[0];
                }
            }
            if (property === 'portfolioType') {
                console.log('data changed');
                if (this.data && this.portfolioType) {
                    this.display = true;
                    if (this.data && this.portfolioType) {
                        this.readyToDisplayReportsChart = true;
                    }
                    this.grantState = this.portfolioType;
                }
            }
        }
    }

    displayReportsChart() {

        this.readyToDisplayReportsChart = false;
        const elemRef: HTMLElement = this.elRef.nativeElement;

        const labels: string[] = [];
        const data: number[] = [];

        const labelsStatus: string[] = [];
        const dataStatus: number[] = [];
        let maxTick = 0;
        let maxStatusTick = 0;
        for (let s of this.selected.summary.summary) {
            labels.push(s.name);
            data.push(s.value);
            if (Number(s.value) > maxTick) {
                maxTick = Number(s.value);
            }
        }

        for (let s of this.selected.summary.statusSummary) {
            if (s.internalStatus === 'DRAFT') {
                this.draftReportsCount += s.value;
            } else if (s.internalStatus === 'CLOSED') {
                this.approvedReportsCount += s.value;
            } else {
                this.inprogressReportsCount += s.value;
            }
            if (s.internalStatus !== 'DRAFT' && s.internalStatus !== 'CLOSED') {
                labelsStatus.push(s.name);
                dataStatus.push(s.value);
                if (Number(s.value) > maxStatusTick) {
                    maxStatusTick = Number(s.value);
                }
            }


        }

        if (this.portfolioType === 'Active Grants') {
            this.pieChart1 = <HTMLCanvasElement>elemRef.getElementsByClassName('pieChart1')[0];
            this.ctx = this.pieChart1.getContext('2d');
            this.ctx.clearRect(0, 0, this.pieChart1.width, this.pieChart1.height);

            this.PieChart1 = new Chart(this.ctx, {
                plugins: [ChartDataLabels],
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        datalabels: {
                            color: 'white',

                            font: {
                                weight: 'bold'
                            },
                            formatter: function (value, context) {
                                if (Number(value) > 0) {
                                    return value;
                                } else {
                                    return '';
                                }
                            }
                        },
                        data: data,
                        backgroundColor: [
                            '#f44336',
                            '#E6CE55'
                        ]
                    }]
                },
                options: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'center'
                    },
                    tooltips: {
                        enabled: false
                    },
                    title: {
                        display: true,
                        fontSize: 14,
                        fontColor: '#bdbdbd',
                        fontStyle: 'normal',
                        text: 'Due Status'
                    }
                }
            });

            this.pieChartX = <HTMLCanvasElement>elemRef.getElementsByClassName('pieChartX')[0];
            this.ctx = this.pieChartX.getContext('2d');
            this.ctx.clearRect(0, 0, this.pieChartX.width, this.pieChartX.height);

            this.PieChartX = new Chart(this.ctx, {
                plugins: [ChartDataLabels],
                type: 'horizontalBar',
                data: {
                    labels: labelsStatus,
                    datasets: [{
                        datalabels: {
                            color: 'black',
                            anchor: 'end',
                            align: 'end',

                            offset: 10,
                            font: {
                                weight: 'bold'
                            },
                            formatter: function (value, context) {
                                if (Number(value) > 0) {
                                    return value;
                                } else {
                                    return '';
                                }
                            }
                        }, barThickness: 'flex',
                        data: dataStatus,
                        backgroundColor: [
                            '#e6ce55',
                            '#c9af27',
                            '#ecc500',
                            '#bd9e05'
                        ]
                    }]
                },
                options: {

                    legend: {
                        display: false,
                        position: 'right',
                        align: 'center'
                    },
                    tooltips: {
                        enabled: false
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            },
                            ticks: {
                                display: false,
                                min: 0,
                                max: maxStatusTick + 1,
                                stepSize: 1
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            }
                        }]
                    },
                    title: {
                        display: true,
                        fontSize: 14,
                        fontColor: '#bdbdbd',
                        fontStyle: 'normal',
                        text: 'In-progress Status'
                    }
                }
            });
        } else if (this.portfolioType === 'Closed Grants') {
            this.pieChart2 = <HTMLCanvasElement>elemRef.getElementsByClassName('pieChart2')[0];
            this.ctx = this.pieChart2.getContext('2d');
            this.ctx.clearRect(0, 0, this.pieChart2.width, this.pieChart2.height);
            this.PieChart2 = new Chart(this.ctx, {
                plugins: [ChartDataLabels],
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        datalabels: {
                            color: 'black',
                            font: {
                                weight: 'bold'
                            },
                            anchor: 'end',
                            align: 'top',
                            offset: 15,
                            formatter: function (value, context) {
                                if (Number(value) > 0) {
                                    return value;
                                } else {
                                    return '';
                                }
                            }
                        },
                        data: data,
                        backgroundColor: '#4dC252'
                    }]
                },
                options: {
                    legend: {
                        display: false,
                        position: 'right',
                        align: 'center'
                    },
                    tooltips: {
                        enabled: false
                    },
                    scales: {
                        yAxes: [
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: "No. of Grants",
                                },
                                ticks: {
                                    min: 0,
                                    max: maxTick + 1,
                                    stepSize: 1
                                }
                            }],
                        xAxes: [
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: "No. of Reports",
                                }
                            }]
                    }
                }
            });
        }
    }

    displayDisbursementsChart() {
        this.readyToDisplayDisbursementsChart = false;
        const elemRef: HTMLElement = this.elRef.nativeElement;
        this.barChart = <HTMLCanvasElement>elemRef.getElementsByClassName('barChart')[0];
        this.ctx = this.barChart.getContext('2d');
        const labels: string[] = [];
        const dataCommitted: any[] = [];
        const dataDisbursed: any[] = [];
        const dataCommittedCounts: any[] = [];
        const dataDisbursedCounts: any[] = [];

        let maxTick = 0;

        for (let s of this.selected.summary.disbursement) {
            labels.push(s.name);

            for (let v of s.values) {
                if (v.name === 'Committed') {
                    dataCommitted.push(v.value);
                    dataCommittedCounts.push(v.count);
                }
                if (v.name === 'Disbursed') {
                    dataDisbursed.push(v.value);
                    dataDisbursedCounts.push(v.count);
                }
                if (Number(v.value) > maxTick) {
                    maxTick = Number(v.value);
                }
            }
        }
        this.BarChart = new Chart(this.ctx, {
            plugins: [ChartDataLabels],
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Grant Level Commitment',
                    data: dataCommitted,
                    backgroundColor: "#4D83C2",
                    datalabels: {
                        color: 'black',
                        font: {
                            weight: 'bold'
                        },
                        anchor: 'end',
                        align: 'top',
                        offset: 10,
                        formatter: function (value, context) {
                            return value;
                        }
                    }
                }, {
                    label: 'Disbursed for the period',
                    data: dataDisbursed,
                    backgroundColor: "#39743C",
                    datalabels: {
                        color: 'black',
                        font: {
                            weight: 'bold'
                        },
                        anchor: 'end',
                        align: 'top',
                        offset: 15,
                        formatter: function (value, context) {
                            return value;
                        }
                    }
                }]
            },
            options: {
                legend: {
                    display: true,
                    position: 'right',
                    align: 'center'
                },
                tooltips: {
                    enabled: false
                },
                scales: {
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: "In Lakhs (₹)",
                            },
                            ticks: {
                                min: 0,
                                max: (Math.ceil(maxTick / 50) * 50) + 500,
                                stepSize: 500
                            }
                        }],
                    xAxes: [
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


    doSomething(ev: any) {
        this.draftReportsCount = 0;
        this.inprogressReportsCount = 0;
        this.approvedReportsCount = 0;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].name === ev.value) {
                if (ev.value === 'Reports') {
                    this.readyToDisplayReportsChart = true;
                    this.readyToDisplayDisbursementsChart = false;
                } else if (ev.value === 'Disbursements') {
                    this.readyToDisplayReportsChart = false;
                    this.readyToDisplayDisbursementsChart = true;
                }
                this.selected = this.data[i];
                return;
            }
        }
    }

}
