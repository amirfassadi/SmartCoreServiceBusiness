import { Business } from '../../src/domain/business/entities/business.entity';
import { BusinessStatus } from '../../src/domain/shared/business-status.value-object';
import { Locale } from '../../src/domain/shared/locale.value-object';
import { Slug } from '../../src/domain/shared/slug.value-object';
import { ServiceDuration } from '../../src/domain/service/value-objects/service-duration.value-object';
import { ServiceCategory } from '../../src/domain/service-category/entities/service-category.entity';
import { Service } from '../../src/domain/service/entities/service.entity';

describe('Phase 1 domain invariants', () => {
  it('accepts valid locale values and rejects invalid ones', () => {
    expect(() => Locale.create('en-US')).not.toThrow();
    expect(() => Locale.create('invalid')).toThrow();
  });

  it('accepts valid slugs and rejects invalid ones', () => {
    expect(() => Slug.create('sample-business')).not.toThrow();
    expect(() => Slug.create('Sample Business')).toThrow();
  });

  it('accepts valid service duration and rejects non-positive values', () => {
    expect(() => ServiceDuration.create(45)).not.toThrow();
    expect(() => ServiceDuration.create(0)).toThrow();
  });

  it('initializes business with draft status and a required profile', () => {
    const business = Business.create({
      slug: 'demo-business',
      defaultLocale: 'en-US',
      supportedLocales: ['en-US', 'fr-FR'],
      timezone: 'UTC',
      currency: 'USD',
      profile: {
        name: 'Demo Business',
        description: 'Example',
        contactEmail: 'hello@example.com',
      },
    }, 'org-123');

    expect(business.status.valueOf()).toBe(BusinessStatus.draft().valueOf());
    expect(business.profile.name).toBe('Demo Business');
  });

  it('rejects self-parent categories', () => {
    const category = ServiceCategory.create({
      businessId: 'business-1',
      name: 'Root',
      slug: 'root',
    });

    expect(() => category.setParent(category.id)).toThrow();
  });

  it('rejects invalid service duration values', () => {
    expect(() => Service.create({
      businessId: 'business-1',
      categoryId: 'category-1',
      name: 'Massage',
      slug: 'massage',
      durationMinutes: 60,
      active: true,
    })).not.toThrow();

    expect(() => Service.create({
      businessId: 'business-1',
      categoryId: 'category-1',
      name: 'Bad Service',
      slug: 'bad-service',
      durationMinutes: 0,
      active: true,
    })).toThrow();
  });
});
