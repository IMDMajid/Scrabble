/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { EASEL_SIZE, INDEX_INVALID } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Player } from '@app/models/player.model';
import { ManipulateService } from './manipulate.service';

describe('ManipulateService', () => {
    let service: ManipulateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ManipulateService);

        const letterA: Letter = { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false };
        const letterB: Letter = { value: 'B', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false };
        const letterC: Letter = { value: 'C', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false };
        const letterD: Letter = { value: 'D', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false };
        const letterE: Letter = { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false };
        const letterWhite: Letter = { value: '*', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false };

        service.letterEaselTab = [letterA, letterE, letterB, letterC, letterD, letterA, letterWhite];
        const firstPlayer = new Player(1, 'Player 1', service.letterEaselTab);
        service['playerService'].addPlayer(firstPlayer);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('pressing a key not present in the easel should unselect all letters', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'z' });
        service.onKeyPress(keyboardEvent);
        expect(service.letterEaselTab.some((letter) => letter.isSelectedForManipulation)).toBeFalse();
    });

    it('pressing a key present in the easel should select the respective letter', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
        service.onKeyPress(keyboardEvent);
        expect(service.letterEaselTab[0].isSelectedForManipulation).toBeTrue();
    });

    it('pressing an invalid key should unselect all letters', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        service.onKeyPress(keyboardEvent);
        expect(service.letterEaselTab.some((letter) => letter.isSelectedForManipulation)).toBeFalse();
    });

    it('selecting the same key two times that is only present once in the easel should unselect the respective letter', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'e' });
        service.onKeyPress(keyboardEvent);
        service.onKeyPress(keyboardEvent);
        expect(service.letterEaselTab[1].isSelectedForManipulation).toBeFalse();
    });

    it('selecting two different keys in the easel should select the latest letter pressed', () => {
        let keyboardEvent = new KeyboardEvent('keydown', { key: 'e' });
        service.onKeyPress(keyboardEvent);
        keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
        service.onKeyPress(keyboardEvent);
        expect(service.usedLetters[0]).toBeTrue();
        expect(service.usedLetters[1]).toBeFalse();
    });

    it('clicking a letter should select the respective letter', () => {
        service.selectWithClick(3);
        expect(service.usedLetters[3]).toBeTrue();
    });

    it('clicking a letter while there is already the same letter selected earlier in the easel should update usedLetters', () => {
        service.usedLetters[0] = true;
        service.selectWithClick(5);
        expect(service.usedLetters[0]).toBeTrue();
        expect(service.usedLetters[5]).toBeTrue();
    });

    it('scrolling up by one wheel tick should call shiftUp', () => {
        spyOn(service, 'shiftUp');
        const event = new WheelEvent('wheel', { deltaY: -1 });
        service.onMouseWheelTick(event);
        expect(service.shiftUp).toHaveBeenCalled();
    });

    it('scrolling down by one wheel tick should call shiftDown', () => {
        spyOn(service, 'shiftDown');
        const event = new WheelEvent('wheel', { deltaY: 1 });
        service.onMouseWheelTick(event);
        expect(service.shiftDown).toHaveBeenCalled();
    });

    it('pressing the left arrow key should shift up the letter selected', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        service.letterEaselTab[3].isSelectedForManipulation = true;
        service.usedLetters[3] = true;
        service.onKeyPress(keyboardEvent);
        expect(service.usedLetters[3]).toBeFalse();
        expect(service.usedLetters[3 - 1]).toBeTrue();
    });

    it('pressing the right arrow key should shift down the letter selected', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        service.letterEaselTab[3].isSelectedForManipulation = true;
        service.usedLetters[3] = true;
        service.onKeyPress(keyboardEvent);
        expect(service.usedLetters[3]).toBeFalse();
        expect(service.usedLetters[3 + 1]).toBeTrue();
    });

    it('pressing the left arrow key while the 1st letter is selected should shift up the letter to the last index', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        service.letterEaselTab[0].isSelectedForManipulation = true;
        service.usedLetters[0] = true;
        service.onKeyPress(keyboardEvent);
        expect(service.usedLetters[0]).toBeFalse();
        expect(service.usedLetters[EASEL_SIZE - 1]).toBeTrue();
    });

    it('pressing the right arrow key while the last letter is selected should shift down the letter to the first index', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        service.letterEaselTab[EASEL_SIZE - 1].isSelectedForManipulation = true;
        service.usedLetters[EASEL_SIZE - 1] = true;
        service.onKeyPress(keyboardEvent);
        expect(service.usedLetters[EASEL_SIZE - 1]).toBeFalse();
        expect(service.usedLetters[0]).toBeTrue();
    });

    it('calling findIndexSelected while there is no selection made should return INDEX_INVALID', () => {
        expect(service.findIndexSelected()).toEqual(INDEX_INVALID);
    });
});