import { Component, EventEmitter, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BodyZone {
  id: string;
  label: string;
  view: 'front' | 'back';
}

export interface PainSelection {
  zone: BodyZone;
  intensity: number;
}

@Component({
  selector: 'app-body-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './body-map.component.html',
  styleUrls: ['./body-map.component.scss']
})
export class BodyMapComponent {
  @Output() zoneSelected = new EventEmitter<PainSelection>();

  currentView = signal<'front' | 'back'>('front');
  hoveredZone = signal<string | null>(null);
  selectedZones = signal<Map<string, number>>(new Map());
  showIntensityPicker = signal<boolean>(false);
  pendingZone = signal<BodyZone | null>(null);
  pickerIntensity = signal<number>(5);

  zones: BodyZone[] = [
    // Front zones
    { id: 'head', label: 'Tête', view: 'front' },
    { id: 'neck-front', label: 'Cou', view: 'front' },
    { id: 'chest-left', label: 'Poitrine gauche', view: 'front' },
    { id: 'chest-right', label: 'Poitrine droite', view: 'front' },
    { id: 'shoulder-left-front', label: 'Épaule gauche', view: 'front' },
    { id: 'shoulder-right-front', label: 'Épaule droite', view: 'front' },
    { id: 'bicep-left', label: 'Biceps gauche', view: 'front' },
    { id: 'bicep-right', label: 'Biceps droit', view: 'front' },
    { id: 'forearm-left-front', label: 'Avant-bras gauche', view: 'front' },
    { id: 'forearm-right-front', label: 'Avant-bras droit', view: 'front' },
    { id: 'hand-left', label: 'Main gauche', view: 'front' },
    { id: 'hand-right', label: 'Main droite', view: 'front' },
    { id: 'abdomen', label: 'Abdomen', view: 'front' },
    { id: 'hip-left', label: 'Hanche gauche', view: 'front' },
    { id: 'hip-right', label: 'Hanche droite', view: 'front' },
    { id: 'quad-left', label: 'Quadriceps gauche', view: 'front' },
    { id: 'quad-right', label: 'Quadriceps droit', view: 'front' },
    { id: 'knee-left-front', label: 'Genou gauche', view: 'front' },
    { id: 'knee-right-front', label: 'Genou droit', view: 'front' },
    { id: 'shin-left', label: 'Tibia gauche', view: 'front' },
    { id: 'shin-right', label: 'Tibia droit', view: 'front' },
    { id: 'foot-left-front', label: 'Pied gauche', view: 'front' },
    { id: 'foot-right-front', label: 'Pied droit', view: 'front' },
    // Back zones
    { id: 'head-back', label: 'Tête (arrière)', view: 'back' },
    { id: 'neck-back', label: 'Nuque', view: 'back' },
    { id: 'shoulder-left-back', label: 'Épaule gauche', view: 'back' },
    { id: 'shoulder-right-back', label: 'Épaule droite', view: 'back' },
    { id: 'upper-back-left', label: 'Haut du dos gauche', view: 'back' },
    { id: 'upper-back-right', label: 'Haut du dos droit', view: 'back' },
    { id: 'tricep-left', label: 'Triceps gauche', view: 'back' },
    { id: 'tricep-right', label: 'Triceps droit', view: 'back' },
    { id: 'forearm-left-back', label: 'Avant-bras gauche', view: 'back' },
    { id: 'forearm-right-back', label: 'Avant-bras droit', view: 'back' },
    { id: 'lower-back', label: 'Bas du dos', view: 'back' },
    { id: 'glute-left', label: 'Fessier gauche', view: 'back' },
    { id: 'glute-right', label: 'Fessier droit', view: 'back' },
    { id: 'hamstring-left', label: 'Ischio-jambier gauche', view: 'back' },
    { id: 'hamstring-right', label: 'Ischio-jambier droit', view: 'back' },
    { id: 'calf-left', label: 'Mollet gauche', view: 'back' },
    { id: 'calf-right', label: 'Mollet droit', view: 'back' },
    { id: 'foot-left-back', label: 'Pied gauche', view: 'back' },
    { id: 'foot-right-back', label: 'Pied droit', view: 'back' },
  ];

  getZoneById(id: string): BodyZone | undefined {
    return this.zones.find(z => z.id === id);
  }

  getZoneColor(zoneId: string): string {
    const intensity = this.selectedZones().get(zoneId);
    if (intensity === undefined) return 'transparent';
    if (intensity <= 2) return 'rgba(255, 235, 59, 0.55)';
    if (intensity <= 4) return 'rgba(255, 152, 0, 0.55)';
    if (intensity <= 6) return 'rgba(244, 67, 54, 0.55)';
    if (intensity <= 8) return 'rgba(183, 28, 28, 0.65)';
    return 'rgba(100, 0, 0, 0.75)';
  }

  getZoneStroke(zoneId: string): string {
    if (this.hoveredZone() === zoneId) return '#00bcd4';
    if (this.selectedZones().has(zoneId)) return '#ef5350';
    return 'transparent';
  }

  onZoneClick(zoneId: string): void {
    const zone = this.getZoneById(zoneId);
    if (!zone) return;
    this.pendingZone.set(zone);
    this.pickerIntensity.set(this.selectedZones().get(zoneId) ?? 5);
    this.showIntensityPicker.set(true);
  }

  confirmSelection(): void {
    const zone = this.pendingZone();
    if (!zone) return;
    const newMap = new Map(this.selectedZones());
    newMap.set(zone.id, this.pickerIntensity());
    this.selectedZones.set(newMap);
    this.zoneSelected.emit({ zone, intensity: this.pickerIntensity() });
    this.showIntensityPicker.set(false);
    this.pendingZone.set(null);
  }

  removeZone(zoneId: string): void {
    const newMap = new Map(this.selectedZones());
    newMap.delete(zoneId);
    this.selectedZones.set(newMap);
    this.showIntensityPicker.set(false);
    this.pendingZone.set(null);
  }

  cancelSelection(): void {
    this.showIntensityPicker.set(false);
    this.pendingZone.set(null);
  }

  toggleView(): void {
    this.currentView.set(this.currentView() === 'front' ? 'back' : 'front');
  }

  getIntensityLabel(value: number): string {
    if (value <= 2) return 'Légère';
    if (value <= 4) return 'Modérée';
    if (value <= 6) return 'Intense';
    if (value <= 8) return 'Sévère';
    return 'Insupportable';
  }

  getSelectedSummary(): { zone: BodyZone; intensity: number }[] {
    const result: { zone: BodyZone; intensity: number }[] = [];
    this.selectedZones().forEach((intensity, id) => {
      const zone = this.getZoneById(id);
      if (zone) result.push({ zone, intensity });
    });
    return result.sort((a, b) => b.intensity - a.intensity);
  }
}