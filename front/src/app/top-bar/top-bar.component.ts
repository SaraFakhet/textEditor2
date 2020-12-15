import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from "../data.service";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit {

  pseudo: string;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentPseudo.subscribe(pseudo => this.pseudo = pseudo);
  }

  onSubmit(form: NgForm) {
    this.data.changePseudo(form.value);
    this.closeLogin();
  }

  openSaveFiles() {
    (document.querySelector('.bg-modal') as HTMLInputElement).style.display = "flex";
  }

  closeSaveFiles() {
    (document.querySelector('.bg-modal') as HTMLInputElement).style.display = "none";
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
}