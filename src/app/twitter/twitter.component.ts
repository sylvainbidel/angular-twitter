import { Component, OnInit } from '@angular/core';
import {Tweet} from '../tweet';
import { TwitterService } from '../twitter.service';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.css']
})
export class TwitterComponent implements OnInit {

  constructor(private twitterService:TwitterService) { }
  tweets$: Observable<Tweet[]>;
  ngOnInit() {
    this.tweets$=this.twitterService.getTweets()
    this.tweets$.subscribe((t)=>{console.log('yo')});
  }

  refresh() {

  }


}
