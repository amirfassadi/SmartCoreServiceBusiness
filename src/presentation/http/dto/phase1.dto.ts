import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsIn, IsInt, IsObject, IsOptional, IsString, Matches, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const localePattern = /^[a-z]{2,3}(?:-[A-Z0-9]{2,8})?$/;
const policyKeyPattern = /^[a-z0-9]+(?:\.[a-z0-9]+)*$/;
const identifierPattern = /^[A-Za-z0-9_-]+$/;

export class BusinessProfileDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  logoUrl?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  contactEmail?: string;
}

export class CreateBusinessDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Matches(slugPattern)
  slug!: string;

  @IsString()
  @Matches(localePattern)
  defaultLocale!: string;

  @IsArray()
  @IsString({ each: true })
  @Matches(localePattern, { each: true })
  @MinLength(1, { each: true })
  supportedLocales!: string[];

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  timezone!: string;

  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  currency!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  profileName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  profileDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  profileLogoUrl?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  profileContactEmail?: string;
}

export class UpdateBusinessProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  logoUrl?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  contactEmail?: string;
}

export class CreateLocationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  address?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  timezone!: string;
}

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  timezone?: string;
}

export class CreateServiceCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MaxLength(100)
  @Matches(slugPattern)
  slug!: string;

  @IsOptional()
  @IsString()
  @Matches(identifierPattern)
  parentCategoryId?: string;
}

export class CreateServiceDto {
  @IsString()
  @Matches(identifierPattern)
  categoryId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MaxLength(100)
  @Matches(slugPattern)
  slug!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationMinutes!: number;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @Matches(identifierPattern)
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(slugPattern)
  slug?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationMinutes?: number;
}

export class UpdateServiceCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(slugPattern)
  slug?: string;

  @IsOptional()
  @IsString()
  @Matches(identifierPattern)
  parentCategoryId?: string;
}

export class LifecycleQueryDto {
  @IsOptional()
  @IsIn(['active', 'archived', 'all'])
  status: 'active' | 'archived' | 'all' = 'active';
}

export class CreatePolicyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Matches(policyKeyPattern)
  policyKey!: string;

  @IsObject()
  policyValueJson!: Record<string, unknown>;
}

export class UpdatePolicyDto {
  @IsObject()
  policyValueJson!: Record<string, unknown>;
}

export const identifierValidation = identifierPattern;
