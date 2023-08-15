import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { Pokemon } from '../models/pokemon';
import { colors } from '../data/colors';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router : Router,
    private http : HttpService) { }
  nameid : string | null = "";
  pokemon : Pokemon = new Pokemon();
  imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
  imgType = "svg";
  activeTab = "STATS";
  ngOnInit(): void {
    this.nameid = this.route.snapshot.paramMap.get('nameid');
    if(!this.nameid){
      this.router.navigate(['404']);
    }else{
      this.nameid = this.nameid.toLowerCase();
      this.getPokemonData();
      
    }
  }
  getPokemonData(){
    if(this.nameid == null) 
      this.nameid = "";
    this.http.getPokemon(this.nameid).subscribe({
      next: data => {
        this.setPokemonData(data);
      },
      error: (e) => {
        this.router.navigate(['404']);
      }
    })
  }
  setPokemonData(data : any){
    this.pokemon.name = data.name;
    this.pokemon.id = data.id;
    this.getPokemonSpeciesData();
    this.setImgUrl(data);
    this.pokemon.imgUrl = this.imgUrl;
    this.pokemon.types = data.types;
    console.log(data.types)
    if(data.types && data.types.length > 0){
      this.pokemon.color = this.getcolorfromcolorslist(data.types[0].type.name);
    }
    this.setPokemonStats(data);
  }
  setPokemonStats(data : any){
    this.pokemon.stats = [];
    let stats = data.stats;
    stats.forEach((elem: any) => {
      let stat = {
        "name" : elem.stat.name,
        "value" : elem.base_stat
      }
      this.pokemon.stats?.push(stat);
    });
  }
  getPokemonSpeciesData(){
    if(this.pokemon.id == null) {
      this.router.navigate(['404']);
      return;
    }
    this.http.getPokemonSpecies(this.pokemon.id+"").subscribe({
      next: res  => {
        this.setPokemonSpeciesData(res);
      },
      error: (e) => {
        this.router.navigate(['404']);
      }
    })
  }
  setPokemonDescription(res : any){
    let flavorTextEntries = res.flavor_text_entries;
    flavorTextEntries.forEach((desc: any) => {
      if(desc.language.name === "en" && desc.version.name === "alpha-sapphire"){
        this.pokemon.description = desc.flavor_text; 
      }
    });
    this.pokemon.description = this.pokemon.description === '' || this.pokemon.description === null ? "no description available" : this.pokemon.description;
  }
  setPokemonSpeciesData(res : any){
    this.setPokemonDescription(res);
    this.http.getEvolutionChain(res.evolution_chain.url).subscribe({
      next: evols  => {
        this.setPokemonEvols(evols);
        
      },
      error: (e) => {
        this.router.navigate(['404']);
      }
    })
  }
  setPokemonEvols(evols : any){
    let chainNames : any[] = [evols.chain.species.name];
    chainNames = this.setChain(evols.chain.evolves_to,chainNames);
    let requests : Observable<any>[] = [];
    for (const name of chainNames) {
      requests.push(
        this.http.getPokemon(name).pipe(
          catchError(() => []),
          map(evols => ({ name: evols.species.name, id: evols.id }))
        )
      );
    }
    if (requests.length > 0) {
      forkJoin(requests).subscribe((evolsArray: any[]) => {
        for (const evols of evolsArray) {
          let chainElement = this.pokemon.evolChain?.find(elem => elem.name === evols.name);
          let imgUrlsplitted = this.imgUrl.split("/");
          imgUrlsplitted.pop();
          if (chainElement) {
            chainElement.imgUrl = imgUrlsplitted.join("/") + "/" + evols.id + "." + this.imgType;
          }else{
            chainElement = {};
            chainElement.name = evols.name;
            chainElement.imgUrl = imgUrlsplitted.join("/") + "/" + evols.id + "." +  this.imgType;
            if(!this.pokemon.evolChain) this.pokemon.evolChain = [];
            this.pokemon.evolChain.push(chainElement);
          }
        }
      });
    }
  }
  setImgUrl(data:any){
    if(data.sprites?.other?.dream_world?.front_default){
      this.imgUrl = data.sprites.other.dream_world.front_default;
      this.imgType = "svg";
    }else if(data.sprites?.other?.home?.front_default){
      this.imgUrl = data.sprites.other.home.front_default;
      this.imgType = "png";
    }else if(data.sprites?.other && data.sprites?.other["official-artwork"] && data.sprites?.other["official-artwork"].front_default){
      this.imgUrl = data.sprites.other["official-artwork"].front_default;
      this.imgType = "png";
    }else{
      this.imgUrl = data.sprites.front_default;
      this.imgType = "png";
    }
  }
  setChain(evolvesTo : any[],chain : any[]) : any[]{
    if(evolvesTo.length > 0){
      chain.push(evolvesTo[0].species.name);
      return this.setChain(evolvesTo[0].evolves_to,chain);
    }
    return chain;
  }
  getcolorfromcolorslist(name : string){
    return colors[name as keyof typeof colors];
  }

  getButtonTabStyle(type:string){
    if( this.activeTab === type){
      return {"background-color" : this.pokemon.color,
              "color" : "white",
              "box-shadow": "0px 0px 10px 0px rgba(93, 190, 98, 0.70)"};
    }else{
      return {"color" : this.pokemon.color,
              "background-color" : "white"};
    }
  }

  setActiveTab(type:string){
    this.activeTab = type;
  }
}
