import { Component, Injectable } from '@angular/core';
import { PainEntry } from '../../models/PainEntry';
import { CommonModule, DatePipe } from '@angular/common';


@Component({
  selector: 'app-body-map',
  standalone: true,
  imports: [
    CommonModule, 
  ],
  templateUrl: './body-map.component.html',
  styleUrl: './body-map.component.scss',
})
export class BodyMapComponent {
  selectedZone = '';
  painEntryList: PainEntry[] = [];

  selectZone(zone: string) {
      this.selectedZone = zone;
      this.addPainEntry(zone);
  }
    

  addPainEntry(zone:string) {
    console.log(this.painEntryList);
    const painEntry : PainEntry = {
      id : 1,
      zone : zone,
      date : new Date(),
      intensity : 1,
      description : "Mal ici et la"
    }

    this.painEntryList.push(painEntry);
    

  }
  
  isSelected(zone: string): boolean {
    return this.selectedZone === zone;
}

  getColor(zone: string): string {
    return this.selectedZone === zone ? 'red' : '#ddd';
  }

}
