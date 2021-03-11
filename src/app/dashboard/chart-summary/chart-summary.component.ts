import { GrantType } from './../../model/dahsboard';
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
    grantTypes: GrantType[] = [];

    constructor(private elRef: ElementRef) {

    }

    ngOnInit() {
        Chart.plugins.unregister(ChartDataLabels);
    }

    ngAfterViewChecked() {
        if (this.readyToDisplayDisbursementsChart) {
            this.displayDisbursementsChart();
        } else if (this.readyToDisplayReportsChart) {
            this.displayReportsChart();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property === 'data') {
                console.log('data changed');
                if (this.data) {
                    this.display = true;
                    if (this.data && this.portfolioType) {
                        this.readyToDisplayDisbursementsChart = true;
                    }
                    this.selected = this.data[0];

                }
            }
            if (property === 'portfolioType') {
                console.log('data changed');
                if (this.data && this.portfolioType) {
                    this.display = true;
                    if (this.data && this.portfolioType) {
                        this.readyToDisplayDisbursementsChart = true;
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



        if (this.portfolioType === 'Active Grants') {
            this.pieChart1 = <HTMLCanvasElement>elemRef.getElementsByClassName('pieChart1')[0];
            this.ctx = this.pieChart1.getContext('2d');
            this.ctx.clearRect(0, 0, this.pieChart1.width, this.pieChart1.height);

            this.PieChart1 = new Chart(this.ctx, {
                plugins: [ChartDataLabels],
                type: 'doughnut',
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
                            '#FFA500', '#f44336'

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
                    }
                }
            });

            for (let i = 0; i < this.grantTypes.length; i++) {
                const labelsStatus: string[] = [];
                const dataStatus: number[] = [];
                let maxTick = 0;
                let maxStatusTick = 0;
                let charData = this.selected.summary.statusSummary.filter(s => s.grantType === this.grantTypes[i].name);
                for (let s of charData) {
                    if (s.internalStatus === 'DRAFT') {
                        this.draftReportsCount += s.value;
                    } else if (s.internalStatus === 'CLOSED') {
                        this.approvedReportsCount += s.value;
                    } else {
                        this.inprogressReportsCount += s.value;
                    }
                    if (s.internalStatus !== 'DRAFT' && s.internalStatus !== 'CLOSED') {
                        const idx = labelsStatus.findIndex(f => f === s.name);
                        if (idx === -1) {
                            labelsStatus.push(s.name);
                            dataStatus.push(s.value);
                        } else {
                            dataStatus[idx] += s.value;
                        }
                    }
                }

                for (let d of dataStatus) {
                    if (maxStatusTick < d)
                        maxStatusTick = Number(d);
                }
                maxStatusTick += 1;
                const pieChartX = <HTMLCanvasElement>elemRef.getElementsByClassName('pieChartX')[i];
                let ctx = pieChartX.getContext('2d');
                ctx.clearRect(0, 0, pieChartX.width, pieChartX.height);

                let PieChartX = new Chart(ctx, {
                    plugins: [ChartDataLabels],
                    type: 'horizontalBar',
                    data: {
                        labels: this.formatLabel(labelsStatus),
                        datasets: [{
                            datalabels: {
                                color: 'black',
                                anchor: 'end',
                                align: 'end',

                                offset: 10,
                                font: {
                                    weight: 'bold',
                                },
                                formatter: function (value, context) {
                                    if (Number(value) > 0) {
                                        return value;
                                    } else {
                                        return '';
                                    }
                                }
                            }, maxBarThickness: 20,
                            data: dataStatus,
                            backgroundColor: [
                                '#2950c5',
                                '#ffa500',
                                '#5cacee',
                                '#436eee',
                                '#00c78c'
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
                                display: "false",
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
                                display: "false",
                                gridLines: {
                                    display: false,
                                    color: "rgba(0, 0, 0, 0)",
                                }
                            }]
                        }
                    }
                });
            }


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
                    label: 'Commitments',
                    data: dataCommitted,
                    backgroundColor: "#FFA500",
                    datalabels: {
                        color: 'black',
                        font: {
                            weight: 'bold'
                        },
                        anchor: 'end',
                        align: 'top',
                        offset: 10,
                        formatter: function (value, context) {
                            return value.split('.')[0];
                        }
                    }
                }, {
                    label: 'Disbursed',
                    data: dataDisbursed,
                    backgroundColor: "#4dc252",
                    datalabels: {
                        color: 'black',
                        font: {
                            weight: 'bold'
                        },
                        anchor: 'end',
                        align: 'top',
                        offset: 15,
                        formatter: function (value, context) {
                            return value.split('.')[0];
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
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            },
                            ticks: {
                                min: 0,
                                max: (Math.ceil(maxTick / 50) * 50) + ((Math.ceil(maxTick / 50) * 50) * 0.2),
                                //stepSize: Math.round(maxTick / 4)
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

    formatLabel(labelStatus: string[]) {
        const labelsArr = [];
        for (let s of labelStatus) {
            const splitArr = s.split(" ");
            if (splitArr.length <= 2) {
                labelsArr.push(s);
            } else {
                let a = [];
                for (let i = 0; i < splitArr.length; i += 2) {
                    a.push((splitArr[i] === undefined ? "" : splitArr[i]) + " " + (splitArr[i + 1] === undefined ? "" : splitArr[i + 1]));
                }
                labelsArr.push(a);
            }
        }
        return labelsArr;
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

                    /* for (let summ of this.selected.summary.statusSummary) {
                        const idx = this.grantTypes.findIndex(gt => gt.name === summ.grantType);
                    } */
                } else if (ev.value === 'Disbursements') {
                    this.readyToDisplayReportsChart = false;
                    this.readyToDisplayDisbursementsChart = true;
                }
                this.selected = this.data[i];
                if (ev.value === 'Reports' && this.selected.summary.statusSummary) {
                    for (let summ of this.selected.summary.statusSummary) {
                        if (summ.grantType !== undefined && (summ.internalStatus !== 'DRAFT' && summ.internalStatus !== 'CLOSED')) {
                            const idx = this.grantTypes.findIndex(gt => ((gt.name === summ.grantType)));
                            if (idx === -1) {
                                const type = new GrantType();
                                type.name = summ.grantType;
                                this.grantTypes.push(type);
                            }
                        }
                    }
                }
                return;
            }
        }
    }

}
