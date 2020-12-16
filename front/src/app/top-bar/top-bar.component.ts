import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Channel } from 'pusher-js';
import { VirtualTimeScheduler } from 'rxjs';
import { DataService } from "../data.service";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit {

  pseudo: string;
  fileName: string;
  channel: Channel;

  constructor(private data: DataService, private http: HttpClient) { }

  ngOnInit() {
    this.data.currentPseudo.subscribe(pseudo => this.pseudo = pseudo);
    this.data.currentFilename.subscribe(fileName => this.fileName = fileName);
    this.data.currentChannel.subscribe(channel => this.channel = channel);
  }

  onSubmitLogin(form: NgForm) {
    this.data.changePseudo(form.value);
    this.closeLogin();
    this.openFilename();
  }

  onSubmitFilename(form: NgForm) {
    this.data.changeFilename(form.value);
    this.data.changeChannel(form.value);
    this.closeFilename();
    this.http.get('http://localhost:5000/open-files/' + form.value).subscribe(data => {});
  }

  openSaveFiles() { 
    (document.querySelector('.bg-modal') as HTMLInputElement).style.display = "flex";
  }

  closeUnsaveFiles() {
    (document.querySelector('.bg-modal') as HTMLInputElement).style.display = "none";
  }

  closeSaveFiles() {
    (document.querySelector('.bg-modal') as HTMLInputElement).style.display = "none";
    var filename = (document.getElementById('submitSaveInput') as HTMLInputElement).value;
    this.data.changeFilename(filename);
    //console.log("filename : " + this.fileName);
  }

  openSelectFiles() {
    (document.querySelector('.bg-modal2') as HTMLInputElement).style.display = "flex";
  }

  closeSelectFiles() {
    (document.querySelector('.bg-modal2') as HTMLInputElement).style.display = "none";
  }

  openRemoveFiles() {
    (document.querySelector('.bg-modal3') as HTMLInputElement).style.display = "flex";
  }

  closeRemoveFiles() {
    (document.querySelector('.bg-modal3') as HTMLInputElement).style.display = "none";
  }

  closeLogin() {
    (document.querySelector('.bg-modal-login') as HTMLInputElement).style.display = "none";
  }

  openFilename() {
    (document.querySelector('.bg-modal-filename') as HTMLInputElement).style.display = "flex";
  }

  closeFilename() {
    (document.querySelector('.bg-modal-filename') as HTMLInputElement).style.display = "none";
  }
}