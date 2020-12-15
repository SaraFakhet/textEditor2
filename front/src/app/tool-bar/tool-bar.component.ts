import { Component, OnInit } from '@angular/core';
import Pusher, { Channel } from 'pusher-js';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../data.service";

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  bold:Boolean = false;
  italic:Boolean = false;
  underline:Boolean = false;
  left:Boolean = false;
  center:Boolean = false;
  right:Boolean = false;
  fontFamily:String = "sans-serif";
  fontSize:any = 14;

  pusher: Pusher;
  channel: Channel;

  pseudo: string;
  filename: string;

  constructor(private http: HttpClient, private data: DataService) { }

  ngOnInit() {
        this.data.currentPseudo.subscribe(pseudo => this.pseudo = pseudo);
        this.data.currentFilename.subscribe(filename => this.filename = filename);
        this.data.currentChannel.subscribe(channel => this.channel = channel);
  }

  setBold(data:Boolean) {
    this.bold=(data);
    if (this.bold)
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

  setItalic(data:Boolean) {
    this.italic=(data);
    console.log(this.italic);
    if (this.italic)
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

  setUnderline(data:Boolean) {
    this.underline=(data);
    if (this.underline)
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
    this.left = true;
    this.center = false;
    this.right = false;

    (document.getElementById('textarea1') as HTMLInputElement).style.textAlign = 'left';
    (document.getElementById('leftId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
    (document.getElementById('centerId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
    (document.getElementById('rightId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
  }

  setCenter() {
    this.left = false;
    this.center = true;
    this.right = false;

    (document.getElementById('textarea1') as HTMLInputElement).style.textAlign = 'center';
    (document.getElementById('leftId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
    (document.getElementById('centerId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
    (document.getElementById('rightId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
  }

    
  setRight() {
    this.left = false;
    this.center = false;
    this.right = true;

    (document.getElementById('textarea1') as HTMLInputElement).style.textAlign = 'right';
    (document.getElementById('leftId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
    (document.getElementById('centerId') as HTMLInputElement).setAttribute('aria-pressed', 'false');
    (document.getElementById('rightId') as HTMLInputElement).setAttribute('aria-pressed', 'true');
  }

  setFontSize(value:any) {

    (document.getElementById('spinButtonId') as HTMLInputElement).innerHTML = value + " pt";
    (document.getElementById('textarea1') as HTMLInputElement).style.fontSize = value + 'pt';
    this.fontSize = value;
  }

  setFontFamily(value:any) {

      (document.getElementById('fontType') as HTMLInputElement).setAttribute('aria-label', 'Font: ' + value);
      (document.getElementById('fontType') as HTMLInputElement).innerHTML = value;
      (document.getElementById('fontType') as HTMLInputElement).style.fontFamily = value;
      (document.getElementById('textarea1') as HTMLInputElement).style.fontFamily = value;
  }

  BoldPress() {
      this.bold = !this.bold;
      this.http.post('http://localhost:5000/tool-box', {'bold': this.bold}).subscribe(data => {});
  }

  ItalicPress() {
    this.italic = !this.italic;
    this.http.post('http://localhost:5000/tool-box', {'italic': this.italic}).subscribe(data => {});
  }

  UnderlinePress() {
    this.underline = !this.underline;
    this.http.post('http://localhost:5000/tool-box', {'underline': this.underline}).subscribe(data => {});
  }

  LeftPress() {
    this.left = true;
    this.center = false;
    this.right = false;
    this.http.post('http://localhost:5000/tool-box', {'align': 'left'}).subscribe(data => {});
  }

  CenterPress() {
    this.center = true;
    this.left = false;
    this.right = false;
    this.http.post('http://localhost:5000/tool-box', {'align': 'center'}).subscribe(data => {});
  }

  RightPress() {
    this.right = true;
    this.center = false;
    this.left = false;
    this.http.post('http://localhost:5000/tool-box', {'align':'right'}).subscribe(data => {});
  }

  IncreasePress() {
    this.fontSize += 1;
    this.http.post('http://localhost:5000/tool-box', {'fontSize':this.fontSize}).subscribe(data => {});
  }

  DecreasePress() {
    this.fontSize -= 1;
    this.http.post('http://localhost:5000/tool-box', {'fontSize':this.fontSize}).subscribe(data => {});
  }

  SansSerifPress() {
    this.fontFamily = "Sans-Serif"
    this.http.post('http://localhost:5000/tool-box', {'fontFamily':this.fontFamily}).subscribe(data => {});
  }

  SerifPress() {
    this.fontFamily = "Serif"
    this.http.post('http://localhost:5000/tool-box', {'fontFamily':this.fontFamily}).subscribe(data => {});
  }

  MonospacePress() {
    this.fontFamily = "Monospace"
    this.http.post('http://localhost:5000/tool-box', {'fontFamily':this.fontFamily}).subscribe(data => {});
  }

  FantasyPress() {
    this.fontFamily = "Fantasy"
    this.http.post('http://localhost:5000/tool-box', {'fontFamily':this.fontFamily}).subscribe(data => {});
  }

  CursivePress() {
    this.fontFamily = "Cursive"
    this.http.post('http://localhost:5000/tool-box', {'fontFamily':this.fontFamily}).subscribe(data => {});
  }
}
