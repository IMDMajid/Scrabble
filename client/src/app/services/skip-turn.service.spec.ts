/* eslint-disable dot-notation */
import { EndGameService } from './end-game.service';
import { GameSettingsService } from './game-settings.service';
import { ONE_SECOND_TIME } from '@app/classes/constants';
import { SkipTurnService } from './skip-turn.service';
import { TestBed } from '@angular/core/testing';

describe('SkipTurnService', () => {
    let service: SkipTurnService;
    let gameSettingsService: jasmine.SpyObj<GameSettingsService>;
    let endGameService: jasmine.SpyObj<EndGameService>;
    beforeEach(() => {
        const settingsSpy = jasmine.createSpyObj('GameSettingsService', ['gameSettings']);
        const endGameSpy = jasmine.createSpyObj('EndGameService', ['isEndGame']);
        TestBed.configureTestingModule({
            providers: [SkipTurnService, { provide: GameSettingsService, useValue: settingsSpy }, { provide: EndGameService, useValue: endGameSpy }],
        });
        service = TestBed.inject(SkipTurnService);
        gameSettingsService = TestBed.inject(GameSettingsService) as jasmine.SpyObj<GameSettingsService>;
        endGameService = TestBed.inject(EndGameService) as jasmine.SpyObj<EndGameService>;
    });

    beforeEach(() => {
        jasmine.clock().install();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should stopTimer when switching turn', () => {
        endGameService.isEndGame = false;
        const spy = spyOn(service, 'stopTimer');
        service.switchTurn();
        expect(spy).toHaveBeenCalled();
    });

    // it('should startTimer when switching turns', () => {
    //     service.isTurn = false;
    //     const newTurn = true;
    //     spyOn(service, 'startTimer').andz;
    //     service.switchTurn();
    //     expect(service.isTurn).toEqual(newTurn);
    //     expect(service.startTimer).toHaveBeenCalled();
    // });

    // it('should clearInterval when stopping timer', () => {
    //     service.stopTimer();
    //     expect(clearInterval).toHaveBeenCalled();
    // });

    /* eslint-disable @typescript-eslint/no-magic-numbers */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // import { ComponentFixture, TestBed } from '@angular/core/testing';
    // import { ONESECOND_TIME } from '@app/classes/constants';
    // import { CountdownComponent } from './countdown.component';

    // describe('CountdownComponent', () => {
    //     let component: CountdownComponent;
    //     let fixture: ComponentFixture<CountdownComponent>;

    //     beforeEach(async () => {
    //         await TestBed.configureTestingModule({
    //             declarations: [CountdownComponent],
    //         }).compileComponents();
    //     });

    //     beforeEach(() => {
    //         fixture = TestBed.createComponent(CountdownComponent);
    //         component = fixture.componentInstance;
    //         fixture.detectChanges();
    //     });

    //     beforeEach(() => {
    //         jasmine.clock().install();
    //     });

    //     afterEach(() => {
    //         jasmine.clock().uninstall();
    //     });

    //     it('should create', () => {
    //         expect(component).toBeTruthy();
    //     });

    //     it('should call setTimer onInit', () => {
    //         component.ngOnInit();
    //         spyOn<any>(component, 'setTimer');
    //         jasmine.clock().tick(ONESECOND_TIME + 1);
    //         expect(component.setTimer).toHaveBeenCalled();
    //     });

    it('should startTimer when switching turns 2', () => {
        service.isTurn = true;
        const newTurn = false;
        endGameService.isEndGame = false;
        const spyStart = spyOn(service, 'startTimer');
        const spyOnAi = spyOn(service, 'bindAiTurn');
        service.switchTurn();
        jasmine.clock().tick(ONE_SECOND_TIME + 1);
        expect(service.isTurn).toEqual(newTurn);
        expect(spyOnAi).toHaveBeenCalled();
        expect(spyStart).toHaveBeenCalled();
    });

    it('should decrease the countdown', () => {
        gameSettingsService.gameSettings.timeMinute = '00';
        gameSettingsService.gameSettings.timeSecond = '59';
        endGameService.isEndGame = false;
        service.startTimer();
        jasmine.clock().tick(ONE_SECOND_TIME + 1);
        expect(service['minutes']).toEqual(0);
        expect(service['seconds']).toEqual(58);
    });

    it('should clearInterval when stopping timer', () => {
        service.stopTimer();
        expect(service['minutes']).toEqual(0);
        expect(service['seconds']).toEqual(0);
    });

    it('adapt time output to correct value when when only seconds input is 0', () => {
        gameSettingsService.gameSettings.timeMinute = '05';
        gameSettingsService.gameSettings.timeSecond = '00';
        endGameService.isEndGame = false;
        service.startTimer();
        jasmine.clock().tick(ONE_SECOND_TIME + 1);
        expect(service['seconds']).toEqual(59);
        expect(service['minutes']).toEqual(4);
    });

    it('should do nothing when it is an endgame', () => {
        endGameService.isEndGame = true;
        service.isTurn = false;
        const newturn = false;
        service.switchTurn();
        expect(service.isTurn).toEqual(newturn);
    });

    it('should stop the timer if it is an end of game of start timer ', () => {
        endGameService.isEndGame = true;
        const spyOnStop = spyOn(service, 'stopTimer');
        service.startTimer();
        expect(spyOnStop).toHaveBeenCalled();
    });

    it('should bind to the playerAi play function', () => {
        const testFn = () => {
            let x = 0;
            return x++;
        };
        service.bindAiTurn(testFn);
        expect(service['playAiTurn']).toEqual(testFn);
    });

    it('should stop the timer and then switch turn when the countdown is done ', () => {
        gameSettingsService.gameSettings.timeMinute = '00';
        gameSettingsService.gameSettings.timeSecond = '00';
        endGameService.isEndGame = false;
        const spyOnStop = spyOn(service, 'stopTimer');
        const spyOnSwitch = spyOn(service, 'switchTurn');
        service.startTimer();
        jasmine.clock().tick(ONE_SECOND_TIME + 1);
        expect(spyOnStop).toHaveBeenCalled();
        jasmine.clock().tick(ONE_SECOND_TIME);
        expect(spyOnSwitch).toHaveBeenCalled();
    });
});
