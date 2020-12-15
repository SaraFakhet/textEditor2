import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher, { Channel } from 'pusher-js';
import { NgForm } from '@angular/forms';
import { DataService } from "../data.service";

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

  constructor(private http: HttpClient, private data: DataService) { 
   }

  ngOnInit() {
    this.data.currentFilename.subscribe(filename => this.filename = filename);
    this.data.currentChannel.subscribe(channel => this.channel = channel);
    this.data.currentText.subscribe(text => this.text = text);
  }

  keyPress(event) {
    this.data.changeText(event);
    if (this.text != '') {
      this.http.post('http://localhost:5000/text-box/' + this.filename, {'body': event}).subscribe(data => {});
      //this.printLoginRoute();
    }
  }

  printLoginRoute() {
    console.log('test');
    this.http.get('http://localhost:5000/').subscribe(data => {
      this.reponse = data;
  }
    );
    console.log(this.reponse);
  }
}