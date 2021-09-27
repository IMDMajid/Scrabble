/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PassTourService {
    // Method to update
    messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();
    private func: () => void;

    updateTour(fn: () => void) {
        this.func = fn;
        // from now on, call myFunc wherever you want inside this service
    }

    changeMessage(message: string) {
        this.messageSource.next(message);
        this.func();
    }
}
