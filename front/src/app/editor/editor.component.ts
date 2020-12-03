import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher, { Channel } from 'pusher-js';
import { NgForm, NgModel } from '@angular/forms';

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

  constructor(private http: HttpClient) { 
   }

  ngOnInit() {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;
    this.pusher = new Pusher('e0f07ea56123ef7bab7b', {
      cluster: 'eu'
    });
    this.channel = this.pusher.subscribe('editor');
  }

  ngAfterViewInit(): void {
    this.channel.bind('text-box', function(data) {
    this.text=(JSON.stringify(data));
      console.log(this.text);
      //alert(this.text);
    });
  }

  //to remove
  patchValue() {
    this.contactForm.control.patchValue({textarea: this.text});
  }

  keyPress(event) {
    this.text = event;
    if (this.text != '') {
      console.log(event);
      this.http.post('http://localhost:5000/text-box', {'body': event}).subscribe(data => {});
      this.printLoginRoute();
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