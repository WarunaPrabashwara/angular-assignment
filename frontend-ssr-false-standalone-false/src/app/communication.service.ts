// this is the srevice to understand if the user has submitted the add user or add course. if submitted we have to reresh the users page and courses page
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private submitSubject = new Subject<void>();

  submitRequest() {
    this.submitSubject.next();
  }

  getSubmitObservable() {
    return this.submitSubject.asObservable();
  }
}
