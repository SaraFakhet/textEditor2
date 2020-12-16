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

  private fontSize = new BehaviorSubject<number>(14);
  currentFontSize = this.fontSize.asObservable();

  private fontFamily = new BehaviorSubject<string>('sans-serif');
  currentFontFamily = this.fontSize.asObservable();

  private historyVersionning = new BehaviorSubject<Object>([]);
  currentHistoryVersionning = this.historyVersionning.asObservable();

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
    this.channelSource.next(this.pusher.subscribe(filename));
    this.channelSource.value.bind('text-box', function(data) {
    this.textSource.next(data['body']);
    }, this);

    this.channelSource.value.bind('version', function(data) {
      console.log('HISTORY');
      console.log(data);
      this.setHistoryVersionning(data);
    }, this);

    this.channelSource.value.bind('tool-box', function(data) {
      //console.log(data);
      if (data['bold'] != undefined) {
        this.setBold(data['bold']);
      }
      if (data['italic'] != undefined)
        this.setItalic(data['italic']);
      if (data['underline'] != undefined)
        this.setUnderline(data['underline']);
      if (data['align'] != undefined)
      {
        if (data['align'] === 'left') {
          console.log("if left");
          this.setLeft();
        }
        else if (data['align'] === 'center') {
          console.log("if center");
          this.setCenter();
        }
        else if (data['align'] === 'right') {
          console.log("if right");
          this.setRight();
        }
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
    this.filenameSource.next(filename);
  }

  changeText(text: string) {
    this.textSource.next(text);
  }

  changeBold() {
    const bool = !this.bold.value;
    this.bold.next(bool);
    return bool;
  }

  setBold(bool: boolean) {
    this.bold.next(bool);
    if (this.bold.value)
    {
      (document.getElementById('textarea1') as HTMLInputElement).style.fontWeight = "bold";
      (document.getElementById('boldId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
    }
    else
     {
      (document.getElementById('textarea1') as HTMLInputElement).style.fontWeight = "normal";
      (document.getElementById('boldId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
     }
  }

  setItalic(data: boolean) {
    this.italic.next(data);
    if (this.italic.value)
    {
      (document.getElementById('textarea1') as HTMLInputElement).style.fontStyle = 'italic';
      (document.getElementById('italicId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
    }
    else
     {
      (document.getElementById('textarea1') as HTMLInputElement).style.fontStyle = 'normal';
      (document.getElementById('italicId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
     }
  }

  setUnderline(data: boolean) {
    this.underline.next(data);
    if (this.underline.value)
    {
      (document.getElementById('textarea1') as HTMLInputElement).style.textDecoration = "underline";
      (document.getElementById('underlineId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
    }
    else
     {
      (document.getElementById('textarea1') as HTMLInputElement).style.textDecoration = "none";
      (document.getElementById('underlineId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
     }
  }

  setLeft() {
    console.log("set left")
    this.left.next(true);
    this.center.next(false);
    this.right.next(false);

    (document.getElementById('textarea1') as HTMLInputElement).style.textAlign = 'left';
    (document.getElementById('leftId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
    (document.getElementById('centerId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
    (document.getElementById('rightId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
  }

  setCenter() {
    console.log("set center");
    this.left.next(false);
    this.center.next(true);
    this.right.next(false);

    (document.getElementById('textarea1') as HTMLInputElement).style.textAlign = 'center';
    (document.getElementById('leftId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
    (document.getElementById('centerId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
    (document.getElementById('rightId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
  }

  setRight() {
    console.log("set right");
    this.left.next(false);
    this.center.next(false);
    this.right.next(true);

    (document.getElementById('textarea1') as HTMLInputElement).style.textAlign = 'right';
    (document.getElementById('leftId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
    (document.getElementById('centerId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
    (document.getElementById('rightId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
  }

  setFontSize(value: number) {
    this.fontSize.next(value);
    (document.getElementById('spinButtonId') as HTMLInputElement).innerHTML = value + " pt";
    (document.getElementById('textarea1') as HTMLInputElement).style.fontSize = value + 'pt';
  }

  setFontFamily(value: string) {
    this.fontFamily.next(value);
    (document.getElementById('fontType') as HTMLInputElement).setAttribute('aria-label', 'Font: ' + value);
    (document.getElementById('fontType') as HTMLInputElement).innerHTML = value;
    (document.getElementById('fontType') as HTMLInputElement).style.fontFamily = value;
    (document.getElementById('textarea1') as HTMLInputElement).style.fontFamily = value;
  }

  setHistoryVersionning(value: any) {
    this.historyVersionning.next(value);
      (document.getElementById('versio_grid') as HTMLInputElement).innerHTML += '<div>\
      <div style="border: 1px solid black; border-radius: 3px; height: 100px; overflow-wrap: anywhere; \
      overflow: hidden; overflow-y: scroll; text-align: justify; font-size: 10px;">' + value.text + '</div> \
      <div style="font-size: 12px; width: 100%;">Modifié par : ' + value.user + '</div> \
      <div style="font-size: 12px; width: 100%;">à : ' + value.date + '</div> \
  </div>';
  }
}
