import { ApiProperty } from '@nestjs/swagger';
import { Level1, Level2, Level3 } from '../../../common/model/location.model';

export class GetProvinceListResponse {
  @ApiProperty()
  provinceList: {
    id: string;
    name: string;
  }[];

  static fromLevel1List(provinceList: Level1[]): GetProvinceListResponse {
    return {
      provinceList: provinceList.map((province) => {
        return {
          id: province.level1_id,
          name: province.name,
        };
      }),
    };
  }
}

export class GetDistrictListResponse {
  districtList: {
    id: string;
    name: string;
  }[];
  static fromLevel2List(districtList: Level2[]): GetDistrictListResponse {
    return {
      districtList: districtList.map((district) => {
        return {
          id: district.level2_id,
          name: district.name,
        };
      }),
    };
  }
}

export class GetWardListResponse {
  wardList: {
    id: string;
    name: string;
  }[];
  static fromLevel3List(wardList: Level3[]): GetWardListResponse {
    return {
      wardList: wardList.map((ward) => {
        return {
          id: ward.level3_id,
          name: ward.name,
        };
      }),
    };
  }
}
