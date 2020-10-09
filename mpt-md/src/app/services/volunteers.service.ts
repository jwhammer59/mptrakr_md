import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Volunteer } from '../models/Volunteer';

@Injectable({
  providedIn: 'root',
})
export class VolunteersService {
  volunteerCollection: AngularFirestoreCollection<Volunteer>;
  volunteertDoc: AngularFirestoreDocument<Volunteer>;
  volunteers: Observable<Volunteer[]>;
  volunteer: Observable<Volunteer>;

  // cantors: Observable<any>;
  // lectors: Observable<any>;
  // ushers: Observable<any>;
  // servers: Observable<any>;
  // emohcs: Observable<any>;
  // techs: Observable<any>;
  // rosarys: Observable<any>;
  // others: Observable<any>;
  // gifts: Observable<any>;
  // giftschildren: Observable<any>;
  // masscoords: Observable<any>;

  constructor(private afs: AngularFirestore) {
    this.volunteerCollection = afs.collection<Volunteer>('mpt_volunteer');
  }

  getVolunteers() {
    this.volunteers = this.volunteerCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Volunteer;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return this.volunteers;
  }

  getVolunteer(id: string): Observable<Volunteer> {
    this.volunteertDoc = this.afs.doc<Volunteer>(`mpt_volunteer/${id}`);
    this.volunteer = this.volunteertDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as Volunteer;
          data.id = action.payload.id;
          return data;
        }
      })
    );
    return this.volunteer;
  }

  addVolunteer(volunteer: Volunteer) {
    this.volunteerCollection.add(volunteer);
  }

  updateVolunteer(volunteer: Volunteer) {
    this.volunteertDoc = this.afs.doc(`mpt_volunteer/${volunteer.id}`);
    this.volunteertDoc.update(volunteer);
  }

  deleteVolunteer(volunteer: Volunteer) {
    this.volunteertDoc = this.afs.doc(`mpt_volunteer/${volunteer.id}`);
    this.volunteertDoc.delete();
  }
}
