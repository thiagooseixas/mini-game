import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.sass"]
})
export class GameComponent implements OnInit {
  HP_MAX = 100;
  MAX_ATTACK = 2;
  PLAYER = 0;
  MONSTER = 1;
  CHANCE_ATTACK_MONSTER = 40;
  CHANCE_HEAL_PLAYER = 25;
  hpPlayer = 100;
  hpMonster = 100;
  totalShifts = 1;
  specialAttackPlayer = false;
  specialAttackMonster = false;
  finish = false;
  blockAttack = false;
  logs = [];
  hitMonster: number;
  rotationPlayer = 0;
  rotationMonster = 0;
  params: any = {};
  dataGame: any = {};

  constructor(private router: Router) { }

  ngOnInit() {
    this.attackMonster();
  }

  randomValue(start: number, end: number) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
  }

  attack(type: number) {
    if (type === this.PLAYER) {
      const hit = this.randomValue(5, 8);
      this.hpMonster -= hit;

      this.logs.push({ 'log': 'Jogador atacou o monstro (-' + hit + ')', 'type': 'player', 'status': 'attack' });
      this.shift(this.PLAYER, hit);
    } else {
      this.attackMonster();
    }
  }

  specialAttack(type: number) {
    if (type === this.PLAYER) {
      this.specialAttackPlayer = true;
      const hit = this.randomValue(7, 11);
      this.hpMonster -= hit;

      this.randomHit();

      this.logs.push({ 'log': 'Jogador usou o ataque especial (-' + hit + ')', 'type': 'player', 'status': 'specialAttack' });
      this.shift(this.PLAYER, hit);

      this.blockAttack = false;
    } else {
      this.attackMonster();
    }
  }

  heal(type: number) {
    if (this.hpPlayer < this.HP_MAX || this.hpMonster < this.HP_MAX) {
      if (type === this.PLAYER) {
        const hit = this.randomValue(5, 10);
        this.hpPlayer += hit;

        if (this.hpPlayer > this.HP_MAX) {
          this.hpPlayer = this.HP_MAX;
        }

        this.logs.push({ 'log': 'Jogador usou a cura (+' + hit + ')', 'type': 'player', 'status': 'heal' });
        this.shift(this.MONSTER, hit);
      } else {
        this.attackMonster();
      }
    }
  }

  randomHit() {
    const blockAttackMonster = this.randomValue(1, 100);
    const healPlayer = this.randomValue(1, 100);

    if (blockAttackMonster <= this.CHANCE_ATTACK_MONSTER) {
      this.blockAttack = true;
    }

    if (healPlayer <= this.CHANCE_HEAL_PLAYER && this.hpPlayer < this.HP_MAX) {
      this.hpPlayer += (this.hitMonster / 2);
    }
  }

  /**
   *
   *
   * @param {number} type - Player or Monster
   * @param {number} hit - Attacks or heal
   * @memberof GameComponent
   */
  shift(type: number, hit: number) {
    if (this.hpMonster <= 0) {
      this.logs.push({ 'log': 'VOCÊ VENCEU"', 'type': 'player', 'status': 'win' });
      this.getInfoGame();
    } else if (this.hpPlayer <= 0) {
      this.logs.push({ 'log': 'VOCÊ PERDEU', 'type': 'monster', 'status': 'lose' });
      this.getInfoGame();
    } else {
      this.totalShifts += 1;

      if (type === this.PLAYER && this.specialAttackPlayer) {
        this.rotationPlayer += 1;
      }

      if (this.rotationPlayer === 3) {
        this.rotationPlayer = 0;
        this.specialAttackPlayer = false;
      }

      if (type === this.MONSTER && this.specialAttackMonster) {
        this.rotationMonster += 1;
      }

      if (this.rotationMonster === 3) {
        this.rotationMonster = 0;
        this.specialAttackMonster = false;
      }

      if (type === this.PLAYER) {
        this.attackMonster();
      }
    }
  }

  attackMonster() {
    if (!this.blockAttack) {
      this.hitMonster = this.randomValue(6, 12);
      this.hpPlayer -= this.hitMonster;

      this.logs.push({ 'log': 'Monstro atacou (-' + this.hitMonster + ')', 'type': 'monster', 'status': 'attack' });
    }
  }

  restart() {
    this.hpPlayer = this.HP_MAX;
    this.hpMonster = this.HP_MAX;
    this.totalShifts = 1;
    this.specialAttackPlayer = false;
    this.logs = [];
  }

  getInfoGame() {
    this.finish = true;

    this.dataGame.score = this.hpPlayer;
    this.dataGame.shifts = this.totalShifts;
  }

  labelClass(status, type) {
    if (status == 'attack' && type == 'player') {
      return 'flex-btn-info';
    } else if (status == 'specialAttack') {
      return 'flex-btn-red';
    } else if (status == 'heal' || type == 'monster') {
      return 'flex-btn-green';
    } else {
      return 'flex-btn-red';
    }
  }

  labelMonster() {
    return { 'justify-content': 'flex-end', 'display': 'flex' };
  }

  quit() {
    this.router.navigateByUrl("/start");
  }

  goRanking() {
    this.router.navigateByUrl("/ranking");
  }
}
