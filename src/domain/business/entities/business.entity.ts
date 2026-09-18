import { BusinessStatus } from '../../shared/business-status.value-object';
import { Currency } from '../../shared/currency.value-object';
import { Locale } from '../../shared/locale.value-object';
import { Slug } from '../../shared/slug.value-object';
import { Timezone } from '../../shared/timezone.value-object';
import { ValidationError } from '../../shared/domain-error';
import { BusinessCreated } from '../../shared/domain-events';
import { v4 as uuid } from 'uuid';

export interface BusinessProfileInput {
  name: string;
  description?: string;
  logoUrl?: string;
  contactEmail?: string;
}

export interface BusinessCreateInput {
  slug: string;
  defaultLocale: string;
  supportedLocales: string[];
  timezone: string;
  currency: string;
  profile: BusinessProfileInput;
}

export class BusinessProfile {
  readonly id: string;
  readonly businessId: string;
  name: string;
  description?: string;
  logoUrl?: string;
  contactEmail?: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(input: {
    id?: string;
    businessId: string;
    name: string;
    description?: string;
    logoUrl?: string;
    contactEmail?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = input.id ?? uuid();
    this.businessId = input.businessId;
    this.name = input.name;
    this.description = input.description;
    this.logoUrl = input.logoUrl;
    this.contactEmail = input.contactEmail;
    this.createdAt = input.createdAt ?? new Date();
    this.updatedAt = input.updatedAt ?? this.createdAt;
  }

  update(input: Partial<Pick<BusinessProfile, 'name' | 'description' | 'logoUrl' | 'contactEmail'>>): void {
    if (input.name !== undefined) this.name = input.name;
    if (input.description !== undefined) this.description = input.description;
    if (input.logoUrl !== undefined) this.logoUrl = input.logoUrl;
    if (input.contactEmail !== undefined) this.contactEmail = input.contactEmail;
    this.updatedAt = new Date();
  }
}

export class Business {
  readonly id: string;
  readonly organizationId: string;
  readonly slug: string;
  readonly defaultLocale: string;
  readonly supportedLocales: string[];
  readonly timezone: string;
  readonly currency: string;
  status: BusinessStatus;
  readonly createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  profile: BusinessProfile;
  events: unknown[] = [];

  constructor(input: {
    id?: string;
    organizationId: string;
    slug: string;
    defaultLocale: string;
    supportedLocales: string[];
    timezone: string;
    currency: string;
    status?: BusinessStatus;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    profile: BusinessProfile;
  }) {
    this.id = input.id ?? uuid();
    this.organizationId = input.organizationId;
    this.slug = Slug.create(input.slug).toString();
    this.defaultLocale = Locale.create(input.defaultLocale).toString();
    this.supportedLocales = input.supportedLocales.map((locale) => Locale.create(locale).toString());
    if (!this.supportedLocales.includes(this.defaultLocale)) {
      throw new ValidationError('Default locale must be included in supported locales.');
    }
    this.timezone = Timezone.create(input.timezone).toString();
    this.currency = Currency.create(input.currency).toString();
    this.status = input.status ?? BusinessStatus.draft();
    this.createdAt = input.createdAt ?? new Date();
    this.updatedAt = input.updatedAt ?? this.createdAt;
    this.deletedAt = input.deletedAt;
    this.profile = input.profile;
    this.events.push(new BusinessCreated(this.id, { slug: this.slug }));
  }

  static create(input: BusinessCreateInput, organizationId: string): Business {
    const businessId = uuid();
    const profile = new BusinessProfile({
      businessId,
      name: input.profile.name,
      description: input.profile.description,
      logoUrl: input.profile.logoUrl,
      contactEmail: input.profile.contactEmail,
    });

    return new Business({
      id: businessId,
      organizationId,
      slug: input.slug,
      defaultLocale: input.defaultLocale,
      supportedLocales: input.supportedLocales,
      timezone: input.timezone,
      currency: input.currency,
      profile,
    });
  }

  updateProfile(input: Partial<Pick<BusinessProfile, 'name' | 'description' | 'logoUrl' | 'contactEmail'>>): void {
    this.profile.update(input);
    this.updatedAt = new Date();
  }

  validateBusinessScope(organizationId: string): void {
    if (this.organizationId !== organizationId) {
      throw new ValidationError('Business access denied.');
    }
  }
}
