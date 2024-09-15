export class Level1 {
  level1_id: string;
  name: string;
  type: string;
  level2s: Level2[];
}

export class Level2 {
  level2_id: string;
  name: string;
  type: string;
  level3s: Level3[];
}
export class Level3 {
  level3_id: string;
  name: string;
  type: string;
}
