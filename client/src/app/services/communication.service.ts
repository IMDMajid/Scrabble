import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private readonly baseUrl: string;
    private wordsToValidate: string[];

    constructor(private readonly http: HttpClient) {
        this.baseUrl = environment.serverUrl;
        this.wordsToValidate = [];
    }

    validationPost(newPlayedWords: Map<string, string[]>): Observable<boolean> {
        this.wordsToValidate = [];
        for (const word of newPlayedWords.keys()) {
            this.wordsToValidate.push(word);
        }
        return this.http
            .post<boolean>(`${this.baseUrl}/api/multiplayer/validateWords`, this.wordsToValidate)
            .pipe(catchError(this.handleError<boolean>('validationPost')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
