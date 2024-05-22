import { PartialType } from '@nestjs/swagger';
import { CreateClerkDto } from './create-clerk.dto';

export class UpdateClerkDto extends PartialType(CreateClerkDto) {}
