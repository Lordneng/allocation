import { Component, OnInit } from '@angular/core';

interface Report {
  versionName: string;
  year: string;
  fileNameUser: string;
  updateBy: string;
  updateDate: string;
}

@Component({
  selector: 'app-distribution-plan-report',
  templateUrl: './distribution-plan-report.component.html',
  styleUrls: ['./distribution-plan-report.component.css'],
})
export class DistributionPlanReportComponent implements OnInit {
  costVersions: Report[];
  popupVisible: boolean = false;
  reportVisible: boolean = false;
  currentReport?: Report;

  constructor() {}

  ngOnInit(): void {
    this.costVersions = [
      {
        versionName: 'Cost ปี 2022 เดือน 05 Rev 1',
        year: '2022',
        fileNameUser: '',
        updateBy: 'dev',
        updateDate: '',
      },
    ];
  }

  onCreate(): void {
    this.popupVisible = true;
  }

  onView(): void {
    this.currentReport = {
      versionName: 'Cost ปี 2022 เดือน 05 Rev 1',
      year: '2022',
      fileNameUser: '',
      updateBy: 'dev',
      updateDate: '',
    };
    this.reportVisible = true;
  }
}
