import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Pusher, { Channel } from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private pseudoSource = new BehaviorSubject<string>('anonymous');
  currentPseudo = this.pseudoSource.asObservable();

  private filenameSource = new BehaviorSubject<string>('file');
  currentFilename = this.filenameSource.asObservable();

  private textSource = new BehaviorSubject<string>('');
  currentText = this.textSource.asObservable();

  private pusher: Pusher;
  private channelSource;
  currentChannel;

  constructor() {
    Pusher.logToConsole = true;
    this.pusher = new Pusher('e0f07ea56123ef7bab7b', {
      cluster: 'eu'
    });
    this.channelSource = new BehaviorSubject<Channel>(this.pusher.subscribe('editor'));
    this.currentChannel = this.channelSource.asObservable();
    
  }

  changeChannel(filename: string) {
    console.log("change channel");
    this.channelSource.next(this.pusher.subscribe(filename));
    this.channelSource.value.bind('text-box', function(data) {
      this.textSource.next(data['body']);
      //this.text=(data['body']);
      if (data['bold'] != undefined)
      this.setBold(data['bold']);
      if (data['italic'] != undefined)
        this.setItalic(data['italic']);
      if (data['underline'] != undefined)
        this.setUnderline(data['underline']);
      if (data['align'] != undefined)
      {
        if (data['align'] == 'left')
          this.setLeft();
        if (data['align'] == 'center')
          this.setCenter();
        if (data['align'] == 'right')
          this.setRight();
      }
      if (data['fontSize'] != undefined)
        this.setFontSize(data['fontSize']);
      if (data['fontFamily'] != undefined)
        this.setFontFamily(data['fontFamily']);
    }, this);
  }

  changePseudo(pseudo: string) {
    this.pseudoSource.next(pseudo);
  }

  changeFilename(filename: string) {
    //console.log("change file name to : " + filename);
    this.filenameSource.next(filename);
  }

  changeText(text: string) {
    //console.log("change file name to : " + filename);
    this.textSource.next(text);
  }
}
