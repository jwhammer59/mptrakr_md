import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Volunteer } from '../../../../models/Volunteer';
import { VolunteersService } from '../../../../services/volunteers.service';
import { DeleteVolunteerComponent } from '../delete-volunteer/delete-volunteer.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-volunteer',
  templateUrl: './detail-volunteer.component.html',
  styleUrls: ['./detail-volunteer.component.scss'],
})
export class DetailVolunteerComponent implements OnInit {
  headerTitle = 'Volunteer Details Page';
  headerColor = 'accent';

  id: string;
  volunteer: Volunteer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: 0,
    familyID: '',
    isAdmin: false,
    isAvailable: false,
    isCantor: false,
    isEMoHC: false,
    isGifts: false,
    isGiftsChild: false,
    isLector: false,
    isMassCoord: false,
    isOther: false,
    isRosary: false,
    isServer: false,
    isTech: false,
    isUsher: false,
    isSaturday: false,
    isSundayEarly: false,
    isSundayLate: false,
    isWeekday: false,
  };

  constructor(
    private volunteersService: VolunteersService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.volunteersService.getVolunteer(this.id).subscribe((volunteer) => {
      this.volunteer = volunteer;
    });
  }

  onDeleteClicked() {
    const dialogRef = this.dialog.open(DeleteVolunteerComponent, {
      width: '325px',
      data: {
        firstName: this.volunteer.firstName,
        lastName: this.volunteer.lastName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        dialogRef.close();
        return;
      } else {
        this.volunteersService.deleteVolunteer(this.volunteer);
      }
      this.router.navigate(['/volunteers']);
    });
  }
}
