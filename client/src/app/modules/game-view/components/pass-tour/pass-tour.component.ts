import { Component, OnDestroy, OnInit } from '@angular/core';
import { PassTourService } from '@app/services/pass-tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pass-tour',
    templateUrl: './pass-tour.component.html',
    styleUrls: ['./pass-tour.component.scss'],
})
export class PassTourComponent implements OnInit, OnDestroy {
    message: string;
    passSubscription: Subscription = new Subscription();

    constructor(private passtourService: PassTourService) {}
    ngOnInit(): void {
        this.passSubscription = this.passtourService.currentMessage.subscribe((message) => (this.message = message));
    }

    toogleTour(): void {
        this.passtourService.writeMessage('!passer');
    }
    ngOnDestroy() {
        this.passSubscription.unsubscribe();
    }
}