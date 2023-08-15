import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(public router : Router,public http : HttpService) { }

  nameId = "";

  ngOnInit(): void {

  }

  search(){
    if(this.nameId){
      this.router.navigate(['pokemon',this.nameId]);
    }
  }
  random(){
    this.http.getAllPokemonSpecies().subscribe({
      next: data => {
       this.navigate(data);
      },
      error: (e) => {
        this.router.navigate(['404']);
      }
    })
  }
  navigate(data:any){
    const max = data.count;
    const randomNumber = Math.floor(Math.random() * max) + 1;
    this.router.navigate(['pokemon',randomNumber]);
  }
}
