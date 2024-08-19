import { PartialType } from '@nestjs/swagger';
import { CreateSocialDto } from './create-social.dto';

export class UpdateSocialDto extends PartialType(CreateSocialDto) {}
