import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-family-ids',
  templateUrl: './family-ids.component.html',
  styleUrls: ['./family-ids.component.scss'],
})
export class FamilyIDsComponent implements OnInit {
  headerTitle = 'Family ID';
  headerColor = 'accent';

  showSpinner: boolean = true;

  isLoading(spinnerStatus: boolean) {
    this.showSpinner = spinnerStatus;
  }

  constructor() {}

  ngOnInit(): void {}
}
