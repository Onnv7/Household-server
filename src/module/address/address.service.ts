import { Injectable } from '@nestjs/common';
import { GetDistrictListResponse, GetProvinceListResponse, GetWardListResponse } from './payload/address.response';
import { DataSeederService } from '../../init/data.init';
import { Level2, Level3 } from '../../common/model/location.model';

@Injectable()
export class AddressService {
  constructor(private readonly dataSeederService: DataSeederService) {}

  getProvinceList(): GetProvinceListResponse {
    return GetProvinceListResponse.fromLevel1List(this.dataSeederService.getLocations());
  }
  getDistrictList(provinceId: string): GetDistrictListResponse {
    return GetDistrictListResponse.fromLevel2List(
      this.dataSeederService.getLocations().find((province) => province.level1_id === provinceId).level2s as Level2[],
    );
  }
  getWardList(provinceId: string, districtId: string): GetWardListResponse {
    return GetWardListResponse.fromLevel3List(
      (
        this.dataSeederService.getLocations().find((province) => province.level1_id === provinceId).level2s as Level2[]
      ).find((district) => district.level2_id === districtId).level3s as Level3[],
    );
  }
}
