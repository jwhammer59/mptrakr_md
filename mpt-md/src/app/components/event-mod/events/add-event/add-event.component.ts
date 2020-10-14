import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models
import { Event } from '../../../../models/Event';
import { Volunteer } from '../../../../models/Volunteer';

// Services
import { EventsService } from 'src/app/services/events.service';
import { VolunteersService } from 'src/app/services/volunteers.service';

// Data Files
import { EVENT_TYPES } from 'src/app/data/event-type'

// RXJS
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  headerTitle = 'Add Events Page';
  headerColor = 'accent';

  // Properties for tracking event status
  eventIsFull: boolean = false;
  prBarCounter: number = 0;
  currentEventType: string;
  eventDate: string;

  // Properties for finding matching family members
  matchingFamilyID: String;
  matchingFamilyArray: Volunteer[];
  familyNameArray = [];

  // Properties for duplicates
  hasDuplicates: boolean;
  hasDuplicateLector: boolean;
  hasDuplicateEMoHC: boolean;
  hasDuplicateServer: boolean;
  hasDuplicateUsher: boolean;
  hasDuplicateRosary: boolean;
  hasDuplicateTech: boolean;

  // Properties for Event Approval Exceptions
  duplicateVolunteerApproval: boolean = false;
  incompleteEventApproval: boolean = false;
  checkForMatchingFamily: boolean = false;

  // Properties to keep track of panels that are completed
  panel1Ready: Boolean = false;
  panel2Ready: Boolean = false;
  panel3Ready: Boolean = false;
  panel4Ready: Boolean = false;

  // All Observables for futer filtering by event date.
  allVolunteers$: Observable<Volunteer[]>;
  onlyCantors$: Observable<any>;
  onlyLectors$: Observable<any>;
  onlyServers$: Observable<any>;
  onlyUshers$: Observable<any>;
  onlyGifts$: Observable<any>;
  onlyGiftsChild$: Observable<any>;
  onlyRosarys$: Observable<any>;
  onlyTechs$: Observable<any>;
  onlyOthers$: Observable<any>;
  onlyEMoHCs$: Observable<any>;
  onlyMassCoords$: Observable<any>;
  selectedVolunteer$: Observable<any>;
  selectedFamilyMembers$: Observable<any>;

  // Observables for Date Specific Form Inputs
  filteredCantors$: Observable<any>;
  filteredLectors$: Observable<any>;
  filteredServers$: Observable<any>;
  filteredUshers$: Observable<any>;
  filteredGifts$: Observable<any>;
  filteredChildGifts$: Observable<any>;
  filteredRosarys$: Observable<any>;
  filteredTechs$: Observable<any>;
  filteredOthers$: Observable<any>;
  filteredEMoHCs$: Observable<any>;
  filteredMassCoords$: Observable<any>;

  addEventForm: FormGroup;

  eventTypes = EVENT_TYPES;

  constructor(
    private eventsService: EventsService,
    private volunteersService: VolunteersService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.addEventForm = this.fb.group({
      date: [new Date(), Validators.required],
      type: ['', Validators.required],
      isFull: [false, Validators.required],
      cantor: ['', Validators.required],
      lector1: ['', Validators.required],
      lector2: ['', Validators.required],
      eMoHC1: ['', Validators.required],
      eMoHC2: ['', Validators.required],
      eMoHC3: ['', Validators.required],
      eMoHC4: ['', Validators.required],
      eMoHC5: ['', Validators.required],
      eMoHC6: ['', Validators.required],
      eMoHC7: ['', Validators.required],
      gifts: ['', Validators.required],
      giftsChild: ['', Validators.required],
      rosary1: ['', Validators.required],
      rosary2: ['', Validators.required],
      other: '',
      usher1: ['', Validators.required],
      usher2: ['', Validators.required],
      usher3: ['', Validators.required],
      usher4: ['', Validators.required],
      usher5: ['', Validators.required],
      massCord: ['', Validators.required],
      server1: ['', Validators.required],
      server2: ['', Validators.required],
      server3: ['', Validators.required],
      tech1: ['', Validators.required],
      tech2: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.disableFormInputs();
    this.loadAllVolunteers();
  }

  loadAllVolunteers() {
    // Get All Volunteers then filter by ministry
    this.allVolunteers$ = this.volunteersService.getVolunteers();

    this.onlyCantors$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isCantor === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyLectors$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isLector === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyServers$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isServer === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyUshers$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isUsher === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyGifts$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isGifts === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyGiftsChild$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isGiftsChild === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyRosarys$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isRosary === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyOthers$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isOther === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyTechs$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isTech === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyEMoHCs$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isEMoHC === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyMassCoords$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isMassCoord === true && volunteer.isAvailable === true
        )
      )
    );
  }

  // Get event form controls reference for use in template
  get f() {
    return this.addEventForm.controls;
  }

  // Logic for Calendar to only show days of the week choosen
  dayAllowedFilter = (d: Date): boolean => {
    const day = d.getDay();
    if (this.currentEventType === 'Weekday') {
      // Only allow weekdays to be selected.
      return day !== 0 && day !== 6;
    } else if (this.currentEventType === 'Saturday') {
      // Only allow Saturday to be selected.
      return (
        day !== 0 &&
        day !== 1 &&
        day !== 2 &&
        day !== 3 &&
        day !== 4 &&
        day !== 5
      );
    } else {
      // Only allow Sunday to be selected.
      return (
        day !== 1 &&
        day !== 2 &&
        day !== 3 &&
        day !== 4 &&
        day !== 5 &&
        day !== 6
      );
    }
  };

  /* When event type is changed, set form
  in preparation of selecting Date
  */
 onEventTypeChanged(e) {
   console.log(e.value);
  this.currentEventType = e.value;
  this.resetPanels();
  this.disableFormInputs();
  this.f.date.enable();
  this.f.date.setValue('');
}

// Check event date against Event Type and verify they match
setEventDate(e) {
  console.log(e.target.value);
  this.eventDate = e.target.value;
  this.setFormInputsActive();
}

// Prepare form inputs based on Event Type
setFormInputsActive() {
  this.enableFormInputs();
  this.setActiveInputs();
  this.getDateAvailableVolunteers(this.currentEventType);
}

// Get volunteers by ministry that are "Available" based on seleted Event Date
getDateAvailableVolunteers(eventType: string) {
  this.filteredCantors$ = this.onlyCantors$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredLectors$ = this.onlyLectors$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredServers$ = this.onlyServers$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredUshers$ = this.onlyUshers$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredGifts$ = this.onlyGifts$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredChildGifts$ = this.onlyGiftsChild$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredRosarys$ = this.onlyRosarys$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredTechs$ = this.onlyTechs$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredOthers$ = this.onlyOthers$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredEMoHCs$ = this.onlyEMoHCs$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );

  this.filteredMassCoords$ = this.onlyMassCoords$.pipe(
    map((volunteers) =>
      volunteers.filter(
        (volunteer: Volunteer) => !volunteer.dateUnAvailable.includes(this.eventDate)
      ).filter((volunteer: Volunteer) => volunteer.eventTypesAvailable.includes(eventType))
    )
  );
}


  updateUI(e) {
    this.panelsReady();

    // Update staffing level after input change
    this.checkStaffingLevel(this.currentEventType);

    /* If "Check for Matching Family" checkbox is checked
     return matching FamilyID. */
    if (this.checkForMatchingFamily) {
      const selectedVolunteer$ = this.allVolunteers$.pipe(
        map((volunteers) =>
          volunteers.filter(
            (volunteers) =>
              volunteers.firstName + ' ' + volunteers.lastName === e.value
          )
        )
      );

      selectedVolunteer$.subscribe((volData) => {
        this.matchingFamilyID = volData.shift().familyID;
        const selectedFamilyMembers$ = this.allVolunteers$.pipe(
          map((volunteers) =>
            volunteers.filter(
              (volunteers) =>
                volunteers.familyID === this.matchingFamilyID.toString()
            )
          )
        );

        selectedFamilyMembers$.subscribe((volData) => {
          this.matchingFamilyArray = volData;
          this.processFamilyID(this.matchingFamilyArray);
        });
      });
    }
  }

  panelsReady() {
    if (
      this.currentEventType === 'Saturday' ||
      this.currentEventType === 'Sunday-Late'
    ) {
      // Check tabs for Saturday
      if (
        this.f.cantor.value &&
        this.f.lector1.value &&
        this.f.lector2.value &&
        this.f.server1.value &&
        this.f.server2.value &&
        this.f.server3.value
      ) {
        this.panel1Ready = true;
      }

      if (
        this.f.eMoHC1.value &&
        this.f.eMoHC2.value &&
        this.f.eMoHC3.value &&
        this.f.eMoHC4.value &&
        this.f.eMoHC5.value &&
        this.f.eMoHC6.value &&
        this.f.eMoHC7.value &&
        this.f.tech1.value &&
        this.f.tech2.value
      ) {
        this.panel2Ready = true;
      }

      if (
        this.f.usher1.value &&
        this.f.usher2.value &&
        this.f.usher3.value &&
        this.f.usher4.value &&
        this.f.usher5.value &&
        this.f.massCord.value
      ) {
        this.panel3Ready = true;
      }

      if (
        this.f.rosary1.value &&
        this.f.rosary2.value &&
        this.f.gifts.value &&
        this.f.giftsChild.value
      ) {
        this.panel4Ready = true;
      }

    } else if (this.currentEventType === 'Sunday-Early') {
      this.panel4Ready = true;
      if (
        this.f.cantor.value &&
        this.f.lector1.value &&
        this.f.lector2.value &&
        this.f.server1.value &&
        this.f.server2.value
      ) {
        this.panel1Ready = true;
      }

      if (this.f.eMoHC1.value && this.f.eMoHC2.value) {
        this.panel2Ready = true;
      }

      if (this.f.usher1.value && this.f.usher2.value) {
        this.panel3Ready = true;
      }

    } else {
      // Set panels for Weekday Event
      this.panel3Ready = true;
      this.panel4Ready = true;

      if (this.f.lector1.value && this.f.server1.value) {
        this.panel1Ready = true;
      }

      if (this.f.eMoHC1.value) {
        this.panel2Ready = true;
      }

    }
  }

  resetPanels() {
    this.panel1Ready = false;
    this.panel2Ready = false;
    this.panel3Ready = false;
    this.panel4Ready = false;
  }

  /* Create new array of only family member names
      that match the familyID and display
      them in a SnackBar
  */
  processFamilyID(data: Volunteer[]) {
    data.map((el) => {
      let firstNameMatch = 'firstName';
      let lastNameMatch = 'lastName';
      let fullName = '';
      firstNameMatch = el.firstName;
      lastNameMatch = el.lastName;
      fullName = firstNameMatch + ' ' + lastNameMatch;
      this.familyNameArray.push(fullName);
    });
    // Create a string from array to use in snackBar
    const snackbarResult = this.familyNameArray.join(' , ');
    this.manualSnackBar(`All family members include: ${snackbarResult}`, 'OK');
    this.familyNameArray = [];
  }

  // Disable all inputs until Event Type is selected
  disableFormInputs() {
    this.f.date.disable();
    this.f.cantor.disable();
    this.f.lector1.disable();
    this.f.lector2.disable();
    this.f.eMoHC1.disable();
    this.f.eMoHC2.disable();
    this.f.eMoHC3.disable();
    this.f.eMoHC4.disable();
    this.f.eMoHC5.disable();
    this.f.eMoHC6.disable();
    this.f.eMoHC7.disable();
    this.f.gifts.disable();
    this.f.giftsChild.disable();
    this.f.rosary1.disable();
    this.f.rosary2.disable();
    this.f.other.disable();
    this.f.usher1.disable();
    this.f.usher2.disable();
    this.f.usher3.disable();
    this.f.usher4.disable();
    this.f.usher5.disable();
    this.f.massCord.disable();
    this.f.server1.disable();
    this.f.server2.disable();
    this.f.server3.disable();
    this.f.tech1.disable();
    this.f.tech2.disable();
  }

  enableFormInputs() {
    this.f.date.enable();
    this.f.cantor.enable();
    this.f.lector1.enable();
    this.f.lector2.enable();
    this.f.eMoHC1.enable();
    this.f.eMoHC2.enable();
    this.f.eMoHC3.enable();
    this.f.eMoHC4.enable();
    this.f.eMoHC5.enable();
    this.f.eMoHC6.enable();
    this.f.eMoHC7.enable();
    this.f.gifts.enable();
    this.f.giftsChild.enable();
    this.f.rosary1.enable();
    this.f.rosary2.enable();
    this.f.other.enable();
    this.f.usher1.enable();
    this.f.usher2.enable();
    this.f.usher3.enable();
    this.f.usher4.enable();
    this.f.usher5.enable();
    this.f.massCord.enable();
    this.f.server1.enable();
    this.f.server2.enable();
    this.f.server3.enable();
    this.f.tech1.enable();
    this.f.tech2.enable();
  }

  setActiveInputs() {
    console.log(this.currentEventType);
    if (this.currentEventType === 'Weekday') {
      // Disable non used volunteers & set value to ''
      this.f.cantor.reset({ value: '', disabled: true });
      this.f.lector2.reset({ value: '', disabled: true });
      this.f.eMoHC2.reset({ value: '', disabled: true });
      this.f.eMoHC3.reset({ value: '', disabled: true });
      this.f.eMoHC4.reset({ value: '', disabled: true });
      this.f.eMoHC5.reset({ value: '', disabled: true });
      this.f.eMoHC6.reset({ value: '', disabled: true });
      this.f.eMoHC7.reset({ value: '', disabled: true });
      this.f.gifts.reset({ value: '', disabled: true });
      this.f.giftsChild.reset({ value: '', disabled: true });
      this.f.rosary1.reset({ value: '', disabled: true });
      this.f.rosary2.reset({ value: '', disabled: true });
      this.f.other.reset({ value: '', disabled: true });
      this.f.usher1.reset({ value: '', disabled: true });
      this.f.usher2.reset({ value: '', disabled: true });
      this.f.usher3.reset({ value: '', disabled: true });
      this.f.usher4.reset({ value: '', disabled: true });
      this.f.usher5.reset({ value: '', disabled: true });
      this.f.massCord.reset({ value: '', disabled: true });
      this.f.server2.reset({ value: '', disabled: true });
      this.f.server3.reset({ value: '', disabled: true });
      this.f.tech1.reset({ value: '', disabled: true });
      this.f.tech2.reset({ value: '', disabled: true });

      // Set Value of fields still used to empty string
      this.f.lector1.setValue('');
      this.f.eMoHC1.setValue('');
      this.f.server1.setValue('');
      this.checkStaffingLevel(this.currentEventType);
    } else if (this.currentEventType === 'Sunday-Early') {
      // Disable non used volunteers & set value to ''
      this.f.eMoHC3.reset({ value: '', disabled: true });
      this.f.eMoHC4.reset({ value: '', disabled: true });
      this.f.eMoHC5.reset({ value: '', disabled: true });
      this.f.eMoHC6.reset({ value: '', disabled: true });
      this.f.eMoHC7.reset({ value: '', disabled: true });
      this.f.gifts.reset({ value: '', disabled: true });
      this.f.giftsChild.reset({ value: '', disabled: true });
      this.f.rosary1.reset({ value: '', disabled: true });
      this.f.rosary2.reset({ value: '', disabled: true });
      this.f.other.reset({ value: '', disabled: true });
      this.f.usher3.reset({ value: '', disabled: true });
      this.f.usher4.reset({ value: '', disabled: true });
      this.f.usher5.reset({ value: '', disabled: true });
      this.f.massCord.reset({ value: '', disabled: true });
      this.f.server3.reset({ value: '', disabled: true });
      this.f.tech1.reset({ value: '', disabled: true });
      this.f.tech2.reset({ value: '', disabled: true });

      // Set Value of fields still used to empty string
      this.f.cantor.setValue('');
      this.f.lector1.setValue('');
      this.f.lector2.setValue('');
      this.f.eMoHC1.setValue('');
      this.f.eMoHC2.setValue('');
      this.f.usher1.setValue('');
      this.f.usher2.setValue('');
      this.f.server1.setValue('');
      this.f.server2.setValue('');
      this.checkStaffingLevel(this.currentEventType);
    } else {
      this.f.cantor.setValue('');
      this.f.lector1.setValue('');
      this.f.lector2.setValue('');
      this.f.eMoHC1.setValue('');
      this.f.eMoHC2.setValue('');
      this.f.eMoHC3.setValue('');
      this.f.eMoHC4.setValue('');
      this.f.eMoHC5.setValue('');
      this.f.eMoHC6.setValue('');
      this.f.eMoHC7.setValue('');
      this.f.gifts.setValue('');
      this.f.giftsChild.setValue('');
      this.f.rosary1.setValue('');
      this.f.rosary2.setValue('');
      this.f.other.setValue('');
      this.f.usher1.setValue('');
      this.f.usher2.setValue('');
      this.f.usher3.setValue('');
      this.f.usher4.setValue('');
      this.f.usher5.setValue('');
      this.f.massCord.setValue('');
      this.f.server1.setValue('');
      this.f.server2.setValue('');
      this.f.server3.setValue('');
      this.f.tech1.setValue('');
      this.f.tech2.setValue('');
      this.checkStaffingLevel(this.currentEventType);
    }
  }

  resetDuplicates() {
    this.hasDuplicateUsher = false;
    this.hasDuplicateLector = false;
    this.hasDuplicateServer = false;
    this.hasDuplicateEMoHC = false;
    this.hasDuplicateRosary = false;
    this.hasDuplicateTech = false;
  }

  checkForDuplicates() {
    this.resetDuplicates();
    //  If Incomplete Event Approval is checked
    //  Do not check for duplicates.
    if (!this.incompleteEventApproval) {
      if (this.currentEventType === 'Weekday') {
        return;
      } else if (this.currentEventType === 'Sunday-Early') {
        // Check for duplicate Lectors
        if (this.f.lector1.value === this.f.lector2.value) {
          return (this.hasDuplicateLector = true);
        }

        // Check for duplicate Servers
        if (this.f.server1.value === this.f.server2.value) {
          return (this.hasDuplicateServer = true);
        }

        // Check for duplicate Eucharstic Ministers
        if (
          this.f.eMoHC1.value === this.f.eMoHC2.value ||
          this.f.eMoHC1.value === this.f.eMoHC3.value ||
          this.f.eMoHC2.value === this.f.eMoHC3.value
        ) {
          return (this.hasDuplicateEMoHC = true);
        }

        // Check for duplicate Ushers
        if (
          this.f.usher1.value === this.f.usher2.value ||
          this.f.usher1.value === this.f.usher3.value ||
          this.f.usher2.value === this.f.usher3.value
        ) {
          return (this.hasDuplicateUsher = true);
        }
      } else {
        // Saturday & Sunday Late Duplicate Checking
        // Check for duplicate Lectors
        if (this.f.lector1.value === this.f.lector2.value) {
          return (this.hasDuplicateLector = true);
        }

        // Check for duplicate Servers
        if (
          this.f.server1.value === this.f.server2.value ||
          this.f.server1.value === this.f.server3.value ||
          this.f.server2.value === this.f.server3.value
        ) {
          return (this.hasDuplicateServer = true);
        }

        // Check for duplicate Eucharstic Ministers
        if (
          this.f.eMoHC1.value === this.f.eMoHC2.value ||
          this.f.eMoHC1.value === this.f.eMoHC3.value ||
          this.f.eMoHC1.value === this.f.eMoHC4.value ||
          this.f.eMoHC1.value === this.f.eMoHC5.value ||
          this.f.eMoHC1.value === this.f.eMoHC6.value ||
          this.f.eMoHC1.value === this.f.eMoHC7.value ||
          this.f.eMoHC2.value === this.f.eMoHC3.value ||
          this.f.eMoHC2.value === this.f.eMoHC4.value ||
          this.f.eMoHC2.value === this.f.eMoHC5.value ||
          this.f.eMoHC2.value === this.f.eMoHC6.value ||
          this.f.eMoHC2.value === this.f.eMoHC7.value ||
          this.f.eMoHC3.value === this.f.eMoHC4.value ||
          this.f.eMoHC3.value === this.f.eMoHC5.value ||
          this.f.eMoHC3.value === this.f.eMoHC6.value ||
          this.f.eMoHC3.value === this.f.eMoHC7.value ||
          this.f.eMoHC4.value === this.f.eMoHC5.value ||
          this.f.eMoHC4.value === this.f.eMoHC6.value ||
          this.f.eMoHC4.value === this.f.eMoHC7.value ||
          this.f.eMoHC5.value === this.f.eMoHC6.value ||
          this.f.eMoHC5.value === this.f.eMoHC7.value ||
          this.f.eMoHC6.value === this.f.eMoHC7.value
        ) {
          return (this.hasDuplicateEMoHC = true);
        }

        // Check for duplicate Tech
        if (this.f.tech1.value === this.f.tech2.value) {
          return (this.hasDuplicateTech = true);
        }

        // Check for duplicate Ushers
        if (
          this.f.usher1.value === this.f.usher2.value ||
          this.f.usher1.value === this.f.usher3.value ||
          this.f.usher1.value === this.f.usher4.value ||
          this.f.usher1.value === this.f.usher5.value ||
          this.f.usher2.value === this.f.usher3.value ||
          this.f.usher2.value === this.f.usher4.value ||
          this.f.usher2.value === this.f.usher5.value ||
          this.f.usher3.value === this.f.usher4.value ||
          this.f.usher3.value === this.f.usher5.value ||
          this.f.usher4.value === this.f.usher5.value
        ) {
          return (this.hasDuplicateUsher = true);
        }

        // Check for duplicate Rosary
        if (this.f.rosary1.value === this.f.rosary2.value) {
          return (this.hasDuplicateRosary = true);
        }
      }
    }
    return;
  }

  checkStaffingLevel(e) {
    this.prBarCounter = 0;
    var eventTypeMultiplier = 0;
    if (e === 'Weekday') {
      eventTypeMultiplier = 33.4;
    } else if (e === 'Sunday-Early') {
      eventTypeMultiplier = 11.2;
    } else {
      eventTypeMultiplier = 4;
    }

    if (this.f.cantor.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.lector1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.lector2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC3.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC4.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC5.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC6.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC7.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.gifts.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.giftsChild.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.rosary1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.rosary2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher3.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher4.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher5.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.massCord.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.server1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.server2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.server3.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.tech1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.tech2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.prBarCounter >= 100) {
      this.prBarCounter = 100;
      this.eventIsFull = true;
      this.addEventForm.controls['isFull'].patchValue(true);
    } else {
      this.eventIsFull = false;
    }
  }

  onSubmit({ value, valid }: { value: Event; valid: boolean }) {
    if (!valid && !this.incompleteEventApproval) {
      // Show Error Message
      this.autoSnackBar('Form Invalid', '');
    } else if (!this.duplicateVolunteerApproval) {
      this.checkForDuplicates();
      if (this.hasDuplicateLector) {
        this.manualSnackBar('You have duplicate lectors!', 'OK');
        return;
      }

      if (this.hasDuplicateEMoHC) {
        this.manualSnackBar('You have duplicate EMoHCs!', 'OK');
        return;
      }

      if (this.hasDuplicateServer) {
        this.manualSnackBar('You have duplicate servers!', 'OK');
        return;
      }

      if (this.hasDuplicateUsher) {
        this.manualSnackBar('You have duplicate ushers!', 'OK');
        return;
      }

      if (this.hasDuplicateRosary) {
        this.manualSnackBar('You have duplicate rosary!', 'OK');
        return;
      }

      if (this.hasDuplicateTech) {
        this.manualSnackBar('You have duplicate technology!', 'OK');
        return;
      }

      if (!this.incompleteEventApproval)
        this.checkStaffingLevel(this.currentEventType);
      if (this.prBarCounter < 100) {
        this.eventIsFull = false;
        this.addEventForm.controls['isFull'].patchValue(false);
      } else {
        this.eventIsFull = true;
        this.addEventForm.controls['isFull'].patchValue(true);
      }

      this.eventsService.addEvent(value);
      this.autoSnackBar('Event Added!', '');
      this.router.navigate(['/events']);
    }
  }

  manualSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      verticalPosition: 'top',
    });
  }

  autoSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
    });
  }
}
