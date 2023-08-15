import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statName'
})
export class StatNamePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case "hp":
        return "HP";
      case "attack":
        return "ATK";
      case "defense":
        return "DEF";
      case "special-attack":
        return "SATK";
      case "special-defense":
        return "SDEF";
      case "speed":
        return "SPD";
      default:
        return value;
    }
    
  }

}
