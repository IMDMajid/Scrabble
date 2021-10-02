/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatboxComponent } from './chatbox.component';

describe('ChatboxComponent', () => {
    let component: ChatboxComponent;
    let fixture: ComponentFixture<ChatboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatboxComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should know when Enter key is pressed', () => {
        const keyboardEvent = new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            charCode: 13,
            keyCode: 13,
            view: window,
            bubbles: true,
        });
        spyOn(component, 'sendPlayerCommand');
        component.handleKeyEvent(keyboardEvent);
        expect(component.sendPlayerCommand).toHaveBeenCalledTimes(1);
    });

    it('should have type error if command is not valid', () => {
        spyOn(component, 'isValid').and.returnValue(false);
        component.message = '';
        component.sendPlayerCommand();
        expect(component.typeMessage).toEqual('error');
    });

    it('should have type player if command is valid', () => {
        spyOn(component, 'isValid').and.returnValue(true);
        component.message = '';
        component.sendPlayerCommand();
        expect(component.typeMessage).toEqual('player');
    });

    it('should call the right function when calling sendPlayerCommand()', () => {
        spyOn(component, 'isValid').and.returnValue(true);

        spyOn<any>(component, 'executeDebugCommand');
        component.command = 'debug';
        component.sendPlayerCommand();
        expect(component['executeDebugCommand']).toHaveBeenCalledTimes(1);

        spyOn<any>(component, 'switchTour');
        component.command = 'passer';
        component.sendPlayerCommand();
        expect(component['switchTour']).toHaveBeenCalledTimes(1);

        spyOn<any>(component, 'executeExchangeCommand');
        component.command = 'echanger';
        component.sendPlayerCommand();
        expect(component['executeExchangeCommand']).toHaveBeenCalledTimes(1);

        spyOn<any>(component, 'executePlaceCommand');
        component.command = 'placer';
        component.sendPlayerCommand();
        expect(component['executePlaceCommand']).toHaveBeenCalledTimes(1);
    });

    it('should have type player if command is valid', () => {
        spyOn(component, 'isValid').and.returnValue(true);
        component.sendPlayerCommand();
        expect(component.typeMessage).toEqual('player');
        expect(component.command).toEqual('');
        expect(component.listMessages).toHaveSize(1);
        expect(component.listMessages).toHaveSize(1);
    });

    it('should send message as System when sendSystemMessage() is called', () => {
        component.sendSystemMessage('System message');
        component.sendSystemMessage('Second system message');
        expect(component.listTypes).toHaveSize(2);
        expect(component.listMessages).toHaveSize(2);
        expect(component.listTypes[0]).toEqual('system');
    });

    it('should send message as opponent when sendOpponentMessage() is called', () => {
        component.sendOpponentMessage('Opponent message');
        component.sendOpponentMessage('Opponent system message');
        expect(component.listTypes).toHaveSize(2);
        expect(component.listMessages).toHaveSize(2);
        expect(component.listTypes[0]).toEqual('opponent');
    });

    it('should know if input is valid', () => {
        component.message = '!debug';
        expect(component.isValid()).toBeTrue();

        component.message = '!passer';
        expect(component.isValid()).toBeTrue();

        component.message = '!échanger *s';
        expect(component.isValid()).toBeTrue();

        component.message = '!échanger';
        expect(component.isValid()).toBeFalse();
        expect(component.message).toEqual('ERREUR : La syntaxe est invalide');

        component.message = '!placer h8h test';
        expect(component.isValid()).toBeTrue();

        component.message = '!placer 333';
        expect(component.isValid()).toBeFalse();

        component.message = '!placer';
        expect(component.isValid()).toBeFalse();

        component.message = '!notok';
        expect(component.isValid()).toBeFalse();

        component.message = 'random text';
        expect(component.isValid()).toBeTrue();
    });

    it('should recieve a debug message when receiveAImessage() is called', () => {
        const message = [{ word: 'papier', nbPt: 6 }];
        component.receiveAImessage(message);
        expect(component.debugMessage).toEqual(message);
    });

    // Need to properly import @ViewChild dependencies to be able to test this
    /* it('should scroll to bottom when scrollToBottom() is called', () => {
        jasmine.clock().install();
        component.scrollToBottom();
        jasmine.clock().tick(1);
        expect(component['myScrollContainer'].nativeElement.scrollTop).toEqual(component['myScrollContainer'].nativeElement.scrollHeight);
        jasmine.clock().uninstall();
    });*/

    // it('should place letter when executePlaceCommand() is called', () => {
    //     spyOn(component['tourService'], 'getTour').and.returnValues(false, true, true);

    //     component.message = '!placer h8h test';
    //     component['executePlaceCommand']();
    //     expect(component.typeMessage).toEqual('error');
    //     expect(component.message).toEqual("ERREUR : Ce n'est pas ton tour");

    //     component.message = '!placer h8h test';
    //     component['executePlaceCommand']();
    //     expect(component.typeMessage).toEqual('error');
    //     expect(component.message).toEqual('ERREUR : Le placement est invalide');
    // });
});
