import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { INDEX_PLAYER_IA, INDEX_REAL_PLAYER } from '@app/classes/constants';
import { GameSettings } from '@app/classes/game-settings';
import { PlayerIA } from '@app/models/player-ia.model';
import { Player } from '@app/models/player.model';
import { CountDownComponent } from '@app/modules/game-view/components/countdown/countdown.component';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { GameSettingsService } from '@app/services/game-settings.service';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-information-panel',
    templateUrl: './information-panel.component.html',
    styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnDestroy, OnInit {
    @ViewChild(CountDownComponent) countDown: CountDownComponent;
    @ViewChild(PlayerAIComponent) playerIA: PlayerAIComponent;
    players: Player[] = new Array<Player>();
    gameSettings: GameSettings;
    tour: boolean;
    reserveSize: number;
    message: string;
    viewSubscription: Subscription = new Subscription();
    constructor(
        private gameSettingsService: GameSettingsService,
        public letterService: LetterService,
        private playerService: PlayerService,
        private tourService: TourService,
    ) {}

    ngOnInit(): void {
        this.gameSettings = this.gameSettingsService.getSettings();
        this.initializePlayers();
        this.players = this.playerService.getPlayers();
        this.initializeFirstTour();
        this.tour = this.tourService.getTour();
        this.reserveSize = this.letterService.getReserveSize();
        this.viewSubscription = this.letterService.currentMessage.subscribe((message) => (this.message = message));
        this.letterService.updateView(this.updateView.bind(this));
    }

    initializePlayers() {
        let player = new Player(1, this.gameSettings.playersName[0], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
        player = new PlayerIA(2, this.gameSettings.playersName[1], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
    }

    initializeFirstTour(): void {
        this.tourService.initializeTour(Boolean(this.gameSettings.startingPlayer.valueOf()));
    }

    reAssignTour(tour: boolean): void {
        this.tourService.initializeTour(tour);
    }

    switchTour(counter: number): void {
        this.tour = this.tourService.getTour();
        if (counter === 0) {
            if (this.tour === false) {
                this.tour = true;
                this.reAssignTour(this.tour);
                this.countDown.setTimer();
            } else if (this.tour === true) {
                this.tour = false;
                this.reAssignTour(this.tour);
                this.countDown.setTimer();
                this.playerIA.play();
            }
        }
    }

    updateView() {
        if (this.message === 'mise a jour') {
            this.reserveSize = this.letterService.getReserveSize();
            this.players[INDEX_REAL_PLAYER].letterTable = this.playerService.getLettersEasel(INDEX_REAL_PLAYER);
            this.players[INDEX_PLAYER_IA].letterTable = this.playerService.getLettersEasel(INDEX_PLAYER_IA);
            this.players[INDEX_REAL_PLAYER].score = this.playerService.getScore(INDEX_REAL_PLAYER);
            this.players[INDEX_PLAYER_IA].score = this.playerService.getScore(INDEX_PLAYER_IA);
        }
    }
    ngOnDestroy(): void {
        this.playerService.clearPlayers();
        this.viewSubscription.unsubscribe();
    }
}
