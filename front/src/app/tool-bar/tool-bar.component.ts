import { Component, OnInit } from '@angular/core';
import Pusher, { Channel } from 'pusher-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  bold:Boolean = false;

  pusher: Pusher;
  channel: Channel;

  constructor(private http: HttpClient) { }

  
  ngOnInit() {
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;
        this.pusher = new Pusher('e0f07ea56123ef7bab7b', {
          cluster: 'eu'
        });
        this.channel = this.pusher.subscribe('editor');
  }

  setBold(dataBold:Boolean) {
    this.bold=(dataBold);
    if (this.bold)
    {
      (document.getElementById('textarea1') as HTMLInputElement).style.fontWeight = "bold";
      (document.getElementById('boldId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
      (document.getElementById('fontType') as HTMLInputElement).setAttribute('aria-label', 'Font: Fantasy');
      (document.getElementById('fontType') as HTMLInputElement).innerHTML = 'FANTASY';
      (document.getElementById('fontType') as HTMLInputElement).style.fontFamily = 'Fantasy';
      (document.getElementById('textarea1') as HTMLInputElement).style.fontFamily = 'Fantasy';
      (document.getElementById('spinButtonId') as HTMLInputElement).innerHTML = "20 pt";
      (document.getElementById('textarea1') as HTMLInputElement).style.fontSize = "20"+ 'pt';
    }
    else
     {
      (document.getElementById('textarea1') as HTMLInputElement).style.fontWeight = "normal";
      (document.getElementById('boldId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
     }
  }

  ngAfterViewInit(): void {
    this.channel.bind('tool-box', function(data) {

    this.setBold(data['bold']);
      
    }, this);
  }

  BoldPress() {
      this.bold = !this.bold;
      console.log("Key Press : " + this.bold);
      this.http.post('http://localhost:5000/tool-box', {'bold': this.bold}).subscribe(data => {});
  }
}
