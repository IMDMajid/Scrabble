import { Injectable } from '@angular/core';
import { BONUS_POSITIONS } from '@app/classes/constants';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { GameTypes } from '@common/game-types';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettings: GameSettings = {
        playersNames: ['', ''],
        startingPlayer: StartingPlayer.Player1,
        timeMinute: '01',
        timeSecond: '00',
        level: 'Facile',
        randomBonus: 'Désactiver',
        bonusPositions: JSON.stringify(Array.from(BONUS_POSITIONS)),
        dictionary: '',
    };
    isSoloMode: boolean;
    gameType: GameTypes;
    isRedirectedFromMultiplayerGame: boolean;
}
