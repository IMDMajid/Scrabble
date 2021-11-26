import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DEFAULT_CHAT_HEIGHT, LOG2990_CHAT_HEIGHT, ONE_SECOND_DELAY, PLAYER_ONE_INDEX, PLAYER_TWO_INDEX } from '@app/classes/constants';
import { TypeMessage } from '@app/classes/enum';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { ChatboxService } from '@app/services/chatbox.service';
import { EndGameService } from '@app/services/end-game.service';
import { SendMessageService } from '@app/services/send-message.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
import { GameSettingsService } from '@app/services/game-settings.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, AfterViewInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    message: string;
    listMessages: string[];
    listTypes: TypeMessage[];

    // Used to access TypeMessage enum in the HTML
    htmlTypeMessage = TypeMessage;

    private typeMessage: TypeMessage;

    constructor(
        private chatBoxService: ChatboxService,
        private sendMessageService: SendMessageService,
        public endGameService: EndGameService,
        private boardHandlerService: BoardHandlerService,
        private skipTurnService: SkipTurnService,
        private gameSettingsService: GameSettingsService,
    ) {
        this.message = '';
        this.listMessages = [];
        this.listTypes = [];
    }

    // Disable the current placement on the board when a click occurs in the chatbox
    @HostListener('mouseup', ['$event'])
    @HostListener('contextmenu', ['$event'])
    clickInChatBox(): void {
        this.boardHandlerService.cancelPlacement();
    }

    ngOnInit(): void {
        this.sendMessageService.displayBound(this.displayMessageByType.bind(this));
        this.initializeChatHeight();
    }

    handleKeyEvent(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.chatBoxService.sendPlayerMessage(this.message);
            this.message = ''; // Clear input

            this.scrollToBottom();
        }
    }

    displayMessageByType(): void {
        if (this.sendMessageService.typeMessage === TypeMessage.Error) {
            this.listTypes.push(this.sendMessageService.typeMessage);
            this.listMessages.push(this.message);
        }
        this.listTypes.push(this.sendMessageService.typeMessage);
        this.listMessages.push(this.sendMessageService.message);
        this.scrollToBottom();
    }

    sendSystemMessage(systemMessage: string): void {
        this.typeMessage = TypeMessage.System;
        this.listTypes.push(this.typeMessage);
        this.listMessages.push(systemMessage);
    }

    scrollToBottom(): void {
        setTimeout(() => {
            // Timeout is used to update the scroll after the last element added
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }, 1);
    }

    initializeChatHeight(): void {
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            if (this.gameSettingsService.gameType) chatBox.style.height = LOG2990_CHAT_HEIGHT + 'vh';
            else chatBox.style.height = DEFAULT_CHAT_HEIGHT + 'vh';
        }
    }

    ngAfterViewInit(): void {
        const findEnd = setInterval(() => {
            this.endGameService.checkEndGame();
            if (this.endGameService.isEndGame) {
                this.chatBoxService.displayFinalMessage(PLAYER_ONE_INDEX);
                this.chatBoxService.displayFinalMessage(PLAYER_TWO_INDEX);
                this.endGameService.getFinalScore(PLAYER_ONE_INDEX);
                this.endGameService.getFinalScore(PLAYER_TWO_INDEX);
                this.skipTurnService.stopTimer();
                clearInterval(findEnd);
            }
        }, ONE_SECOND_DELAY);
    }
}
