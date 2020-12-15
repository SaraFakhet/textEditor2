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

  private bold = new BehaviorSubject<boolean>(false);
  currentBold = this.bold.asObservable();

  private italic = new BehaviorSubject<boolean>(false);
  currentItalic = this.italic.asObservable();

  private underline = new BehaviorSubject<boolean>(false);
  currentUnderline = this.underline.asObservable();

  private left = new BehaviorSubject<boolean>(true);
  currentLeft = this.left.asObservable();

  private center = new BehaviorSubject<boolean>(false);
  currentCenter = this.center.asObservable();

  private right = new BehaviorSubject<boolean>(false);
  currentRight = this.right.asObservable();

  /*private fontFamily:String = "sans-serif";
  private fontSize:any = 14;
*/
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
      if (data['bold'] != undefined)
        this.bold.next(data['bold']);
      //this.setBold(data['bold']);
      if (data['italic'] != undefined)
        this.italic.next(data['italic']);
        //this.setItalic(data['italic']);
      if (data['underline'] != undefined)
        this.underline.next(data['underline']);
        //this.setUnderline(data['underline']);
      if (data['align'] != undefined)
      {
        if (data['align'] == 'left') {
          this.left.next(true);
          this.center.next(false);
          this.right.next(false);
          //this.setLeft();
        }
        if (data['align'] == 'center')
          this.center.next(true);
          //this.setCenter();
        if (data['align'] == 'right')
          this.right.next(true);
          //this.setRight();
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

  changeBold() {
    const bool = !this.bold.value;
    this.bold.next(bool);
    return bool;
  }
}
