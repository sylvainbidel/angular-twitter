import { Injectable } from '@angular/core';
import {Tweet} from './tweet';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { NgZone  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor( private http: HttpClient, private zone: NgZone) { }
  tweets:Tweet[]=[];
  getTweets():Observable<Tweet[]> {
     return Observable.create((observer) => {
          this.tweets = [];
          let eventSource = new EventSource('http://localhost:9095/tweets?q=guitar');
          eventSource.onmessage = (event) => {
           console.log('Received event: ', event);
            let json = JSON.parse(event.data);

            console.log('TWEET '+json['text']);
            this.tweets.unshift(new Tweet(json['text']));
            observer.next(this.tweets);
            this.zone.run(() => {});
          };
          eventSource.onerror = (error) => {
            // readyState === 0 (closed) means the remote source closed the connection,
            // so we can safely treat it as a normal situation. Another way of detecting the end of the stream
            // is to insert a special element in the stream of events, which the client can identify as the last one.
            if(eventSource.readyState === 0) {
              console.log('The stream has been closed by the server.');
              eventSource.close();
              observer.complete();
            } else {
              observer.error('EventSource error: ' + error);
            }
          }
        });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead



      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
