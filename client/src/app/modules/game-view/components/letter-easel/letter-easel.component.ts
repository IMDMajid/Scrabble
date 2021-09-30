import { Component, OnInit } from '@angular/core';
import { DEFAULT_FONT_SIZE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
// eslint-disable-next-line import/no-deprecated
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-letter-easel',
    templateUrl: './letter-easel.component.html',
    styleUrls: ['./letter-easel.component.scss'],
})
export class LetterEaselComponent implements OnInit {
    letterEaselTab: Letter[];

    fontSize: number = DEFAULT_FONT_SIZE;

    constructor(private playerService: PlayerService) {}

    ngOnInit(): void {
        this.playerService.updateLettersEasel(this.update.bind(this));
        this.update();
    }

    update(): void {
        this.letterEaselTab = this.playerService.getLettersEasel(0);
    }

    fontSizeEvent(event: number) {
        this.fontSize = event;
        this.playerService.updateFontSize(this.fontSize);
    }
}
