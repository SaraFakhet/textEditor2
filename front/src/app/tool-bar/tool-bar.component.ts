import { Component, OnInit } from '@angular/core';
import Pusher, { Channel } from 'pusher-js';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../data.service";
import baseUrl from '../baseUrl';

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
  differ: any;

  pseudo: string;
  filename: string;

  constructor(private http: HttpClient, private data: DataService) { }

  ngOnInit() {
        this.data.currentPseudo.subscribe(pseudo => this.pseudo = pseudo);
        this.data.currentFilename.subscribe(filename => this.filename = filename);
        this.data.currentChannel.subscribe(channel => this.channel = channel);
        this.data.currentBold.subscribe(bold => this.bold = bold);
        this.data.currentItalic.subscribe(italic => this.italic = italic);
        this.data.currentUnderline.subscribe(underline => this.underline = underline);
        this.data.currentLeft.subscribe(left => this.left = left);
        this.data.currentCenter.subscribe(center => this.center = center);
        this.data.currentRight.subscribe(right => this.right = right);
        this.data.currentFontSize.subscribe(fontSize => this.fontSize = fontSize);
  }

  BoldPress() {
      this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'bold': !this.bold}).subscribe(data => {});
  }

  ItalicPress() {
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'italic': !this.italic}).subscribe(data => {});
  }

  UnderlinePress() {
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'underline': !this.underline}).subscribe(data => {});
  }

  LeftPress() {
    console.log("leftpress");
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'align': 'left'}).subscribe(data => {});
  }

  CenterPress() {
    console.log("centerpress");
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'align': 'center'}).subscribe(data => {});
  }

  RightPress() {
    console.log("rightpress");
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'align':'right'}).subscribe(data => {});
  }

  IncreasePress() {
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'fontSize':this.fontSize + 1}).subscribe(data => {});
  }

  DecreasePress() {
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'fontSize':this.fontSize - 1}).subscribe(data => {});
  }

  SansSerifPress() {
    this.fontFamily = "Sans-Serif"
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'fontFamily':this.fontFamily}).subscribe(data => {});
  }

  SerifPress() {
    this.fontFamily = "Serif"
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'fontFamily':this.fontFamily}).subscribe(data => {});
  }

  MonospacePress() {
    this.fontFamily = "Monospace"
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'fontFamily':this.fontFamily}).subscribe(data => {});
  }

  FantasyPress() {
    this.fontFamily = "Fantasy"
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'fontFamily':this.fontFamily}).subscribe(data => {});
  }

  CursivePress() {
    this.fontFamily = "Cursive"
    this.http.post(baseUrl.URL + '/tool-box/' + this.filename, {'fontFamily':this.fontFamily}).subscribe(data => {});
  }
}
