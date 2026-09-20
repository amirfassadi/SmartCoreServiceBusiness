import { Business } from '../../src/domain/business/entities/business.entity';
import { BusinessStatus } from '../../src/domain/shared/business-status.value-object';
import { Locale } from '../../src/domain/shared/locale.value-object';
import { Slug } from '../../src/domain/shared/slug.value-object';
import { ServiceDuration } from '../../src/domain/service/value-objects/service-duration.value-object';
import { ServiceCategory } from '../../src/domain/service-category/entities/service-category.entity';
import { Service } from '../../src/domain/service/entities/service.entity';
import { BusinessLocation } from '../../src/domain/business-location/entities/business-location.entity';
import { BusinessPolicy } from '../../src/domain/business-policy/entities/business-policy.entity';

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

  it('generates UUID identifiers for domain entities', () => {
    const business = Business.create({ slug: 'uuid-business', defaultLocale: 'en-US', supportedLocales: ['en-US'], timezone: 'UTC', currency: 'USD', profile: { name: 'Business' } }, 'org-123');
    const location = BusinessLocation.create({ businessId: business.id, name: 'Main', timezone: 'UTC' });
    const category = ServiceCategory.create({ businessId: business.id, name: 'Root', slug: 'root' });
    const service = Service.create({ businessId: business.id, categoryId: category.id, name: 'Service', slug: 'service', durationMinutes: 30 });
    const policy = BusinessPolicy.create({ businessId: business.id, policyKey: 'service.confirmation', policyValueJson: { required: true } });

    for (const id of [business.id, business.profile.id, location.id, category.id, service.id, policy.id]) {
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    }
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
    })).not.toThrow();

    expect(() => Service.create({
      businessId: 'business-1',
      categoryId: 'category-1',
      name: 'Bad Service',
      slug: 'bad-service',
      durationMinutes: 0,
    })).toThrow();
  });
});
