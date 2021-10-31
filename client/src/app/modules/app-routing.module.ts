/* eslint-disable sort-imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '@app/components/page-not-found/page-not-found.component';
import { JoinRoomComponent } from '@app/pages/join-room/join-room.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { WaitingRoomComponent } from '@app/pages/waiting-room/waiting-room.component';
import { GameViewComponent } from './game-view/game-view/game-view.component';
import { FormComponent } from './initialize-solo-game/form/form.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'solo-game-ai', component: FormComponent },
    { path: 'multiplayer-mode', component: FormComponent },
    { path: 'multiplayer-mode-waiting-room', component: WaitingRoomComponent },
    { path: 'join-room', component: JoinRoomComponent },
    { path: 'game', component: GameViewComponent },
    { path: 'page-not-found', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
