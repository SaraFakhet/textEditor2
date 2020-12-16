import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher, { Channel } from 'pusher-js';
import { NgForm } from '@angular/forms';
import { DataService } from "../data.service";
import baseUrl from '../baseUrl';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})


export class EditorComponent implements OnInit {

  text = '';
  reponse: Object;
  @ViewChild('contactForm') contactForm: NgForm;
  pusher: Pusher;
  channel: Channel;
  filename: string;
  history: Object;
  pseudo: string;

  constructor(private http: HttpClient, private data: DataService) { 
   }

  ngOnInit() {
    this.data.currentFilename.subscribe(filename => this.filename = filename);
    this.data.currentChannel.subscribe(channel => this.channel = channel);
    this.data.currentText.subscribe(text => this.text = text);
    this.data.currentPseudo.subscribe(pseudo => this.pseudo = pseudo);
  }

  keyPress(event) {
    this.data.changeText(event);
    if (this.text != '') {
      this.http.post(baseUrl.URL + '/text-box/' + this.filename, {'body': event, 'user': this.pseudo}).subscribe(data => {});
      //this.printLoginRoute();
    }
    this.history = this.http.get(baseUrl.URL + '/versions/' + this.filename).subscribe(data => {});
    console.log('HISTORY 2:');
    console.log(this.history);
  }

  printLoginRoute() {
    console.log('test');
    this.http.get(baseUrl.URL).subscribe(data => {
      this.reponse = data;
  }
    );
    console.log(this.reponse);
  }
}