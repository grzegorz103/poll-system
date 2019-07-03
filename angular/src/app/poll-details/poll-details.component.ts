import { Component, OnInit } from '@angular/core';
import { PollService } from 'app/poll-list/poll.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Poll } from 'app/poll-list/poll-list.component';
import { ChartType } from 'app/lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import * as MyLegend from 'chartist-plugin-legend';
@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.scss']
})
export class PollDetailsComponent implements OnInit {

  urlId: number;
  poll: Poll;
  selectedItem: number;
  chartType: any;
  chartData: any;
  chartLegendItems: any;
  public activityChartOptions: any;
  public activityChartResponsive: any[];
  colors: any;
  barChart: any;
  barChartOptions: any;
  barChartData: any;
  display: boolean;

  constructor(
    private pollService: PollService,
    private router: Router,
    private rt: ActivatedRoute
  ) {
    var tester = new MyLegend();
    this.colors = ['#1DC7EA', '#FB404B', '#FFA534', '#9368E9', '#87CB16', '#1F77D0', '#5e5e5e', '#dd4b39', '#35465c', '#e52d27', '#55acee', '#cc2127', '#1769ff', '#6188e2', '#a748ca'];
    this.barChart = ChartType.Bar;
  }

  ngOnInit() {
    this.rt.params.subscribe(params => this.urlId = params['id']);
    this.fetchData();
  }

  fetchData() {
    this.pollService.findById(this.urlId).subscribe(res => {
      this.poll = res;
      let voteCount = 0;
      if (this.poll !== null) {
        this.poll.votes.forEach(e => voteCount += e.voteCount);
        if (voteCount > 0) {
          let labels = [];
          let series = [];
          let votes = [];
          for (let i = 0; i < this.poll.votes.length; ++i) {
            //      this.chartData.push((this.poll.votes[i].voteCount / voteCount) * 100);
            let percent = Math.round((this.poll.votes[i].voteCount / voteCount) * 100);
            let label = this.poll.votes[i].name.trim();
            labels.push(label.length > 15 ? label.substring(0, 15) + ' ' + percent + '%' : label + ' ' + percent + '%' );
            series.push(percent);
            votes.push(this.poll.votes[i].voteCount);
          }
          this.chartType = ChartType.Pie;
          this.chartData = { labels, series };
         // this.chartLegendItems = [
           // { title: 'Open', imageClass: 'fa fa-circle text-info' },
            //{ title: 'Bounce', imageClass: 'fa fa-circle text-danger' },
            //{ title: 'Unsubscribe', imageClass: 'fa fa-circle text-warning' }
         // ];
         // for (let i = 0; i < this.poll.votes.length; ++i) {
         //   this.chartLegendItems.push({ title: this.poll.votes[i].name, imageClass: 'fa fa-circle color' + i });
         // }
          this.activityChartOptions = {
            height: '245px',
            //  plugins: [Chartist.plugins.legend()]
          };
          this.activityChartResponsive = [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                }
              }
            }]
          ];
          console.log(series);
          this.barChartData = { labels, series:[votes] };
          this.barChartOptions = {
            seriesBarDistance: 10,
            axisX: {
              showGrid: false
            },
            height: '245px'
          };
        }
      }
    });
  }

  vote() {
    this.pollService.vote(this.selectedItem).subscribe(res => alert("Thank you for voting"));
  }

  displayStats(){
    this.display = !this.display;
  }
}
