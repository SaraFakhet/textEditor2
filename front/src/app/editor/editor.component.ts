import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})


export class EditorComponent implements OnInit {

  text = '';
  reponse: Object;
  
  constructor(private http: HttpClient) { 
   }

  ngOnInit() {

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