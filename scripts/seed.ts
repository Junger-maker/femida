import { prisma } from '../lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  // Hidden test account
  const testPassword = await bcrypt.hash('F\$UgO16mq1', 10);
  await prisma.user.upsert({
    where: { email: 'abacus-0a7691b1@example.com' },
    update: {},
    create: { email: 'abacus-0a7691b1@example.com', password: testPassword, name: 'Test Admin', role: 'admin' },
  });

  // Slides
  const slides = [
    { titleRu: 'Защита ваших прав — наша миссия', titleEn: 'Protecting Your Rights Is Our Mission', subtitleRu: 'Команда опытных юристов с многолетним стажем', subtitleEn: 'A team of experienced lawyers with years of practice', sortOrder: 1 },
    { titleRu: 'Споры по недвижимости', titleEn: 'Real Estate Disputes', subtitleRu: 'Эффективное решение жилищных и земельных споров', subtitleEn: 'Effective resolution of housing and land disputes', sortOrder: 2 },
    { titleRu: 'Защита прав потребителей', titleEn: 'Consumer Rights Protection', subtitleRu: 'Поможем вернуть деньги и защитить ваши интересы', subtitleEn: 'We will help recover funds and protect your interests', sortOrder: 3 },
    { titleRu: 'Корпоративное право', titleEn: 'Corporate Law', subtitleRu: 'Полное юридическое сопровождение бизнеса', subtitleEn: 'Full legal support for business', sortOrder: 4 },
  ];

  for (const slide of slides) {
    await prisma.slide.upsert({
      where: { id: \`slide-\${slide.sortOrder}\` },
      update: slide,
      create: { id: \`slide-\${slide.sortOrder}\`, ...slide, published: true },
    });
  }

  // Team Members
  const team = [
    { id: 'tm-1', nameRu: 'Иванов Александр Сергеевич', nameEn: 'Alexander Ivanov', positionRu: 'Управляющий партнёр', positionEn: 'Managing Partner', bioRu: 'Опыт работы более 15 лет. Специализация: корпоративное право.', bioEn: 'Over 15 years of experience. Specialization: corporate law.', sortOrder: 1 },
    { id: 'tm-2', nameRu: 'Петрова Елена Викторовна', nameEn: 'Elena Petrova', positionRu: 'Старший юрист', positionEn: 'Senior Lawyer', bioRu: 'Специалист по гражданским делам и семейному праву.', bioEn: 'Specialist in civil cases and family law.', sortOrder: 2 },
    { id: 'tm-3', nameRu: 'Сидоров Дмитрий Андреевич', nameEn: 'Dmitry Sidorov', positionRu: 'Ўрист', positionEn: 'Lawyer', bioRu: 'Защита прав потребителей и споры по недвижимости.', bioEn: 'Consumer protection and real estate disputes.', sortOrder: 3 },
    { id: 'tm-4', nameRu: 'Кузнецова Мария Игоревна', nameEn: 'Maria Kuznetsova', positionRu: 'Помощник юриста', positionEn: 'Legal Assistant', bioRu: 'Подготовка документов и аналитика.', bioEn: 'Document preparation and analysis.', sortOrder: 4 },
  ];

  for (const m of team) {
    await prisma.teamMember.upsert({
      where: { id: m.id },
      update: { nameRu: m.nameRu, nameEn: m.nameEn, positionRu: m.positionRu, positionEn: m.positionEn, bioRu: m.bioRu, bioEn: m.bioEn, sortOrder: m.sortOrder },
      create: { ...m, published: true },
    });
  }

  // Projects
  const projects = [
    { id: 'proj-1', slug: 'spor-nedvizhimost-tverskaya', titleRu: 'Спор о праве собственности на квартиру', titleEn: 'Property Rights Dispute', category: 'residential', year: 2024, descriptionRu: 'Успешное разрешение спора о праве собственности на жильё в Москве.', descriptionEn: 'Successful resolution of property rights dispute in Moscow.' },
    { id: 'proj-2', slug: 'korporativnyy-spor-ooo', titleRu: 'Корпоративный спор ООО', titleEn: 'LLC Corporate Dispute', category: 'commercial', year: 2024, descriptionRu: 'Защита интересов миноритарного участника ООО.', descriptionEn: 'Protection of minority LLC shareholder interests.' },
    { id: 'proj-3', slug: 'trudovoy-spor-uvol', titleRu: 'Трудовой спор о незаконном увольнении', titleEn: 'Unlawful Dismissal Dispute', category: 'public', year: 2023, descriptionRu: 'Восстановление работника на рабочем месте с компенсацией.', descriptionEn: 'Reinstatement of employee with compensation.' },
    { id: 'proj-4', slug: 'nasledstvennyy-spor', titleRu: 'Наследственный спор', titleEn: 'Inheritance Dispute', category: 'residential', year: 2023, descriptionRu: 'Раздел наследственного имущества между наследниками.', descriptionEn: 'Division of inherited property among heirs.' },
    { id: 'proj-5', slug: 'zashita-prav-potrebiteley-avto', titleRu: 'Защита прав потребителя при покупке авто', titleEn: 'Consumer Protection in Car Purchase', category: 'public', year: 2022, descriptionRu: 'Возврат денежных средств за некачественный автомобиль.', descriptionEn: 'Refund for defective vehicle.' },
    { id: 'proj-6', slug: 'arenda-kommercheskoy-nedvizhimosti', titleRu: 'Спор по аренде коммерческой недвижимости', titleEn: 'Commercial Lease Dispute', category: 'commercial', year: 2023, descriptionRu: 'Расторжение договора аренды с компенсацией убытков.', descriptionEn: 'Lease termination with damage compensation.' },
    { id: 'proj-7', slug: 'remont-kvartiry-spor', titleRu: 'Спор о качестве ремонта', titleEn: 'Renovation Quality Dispute', category: 'interior', year: 2024, descriptionRu: 'Взыскание ущерба за некачественный ремонт квартиры.', descriptionEn: 'Damage recovery for poor apartment renovation.' },
    { id: 'proj-8', slug: 'dolevoe-stroitelstvo', titleRu: 'Долевое строительство: задержка сдачи', titleEn: 'Shared Construction: Delivery Delay', category: 'residential', year: 2022, descriptionRu: 'Взыскание неустойки с застройщика за нарушение сроков.', descriptionEn: 'Penalty recovery from developer for deadline violation.' },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: { titleRu: p.titleRu, titleEn: p.titleEn, descriptionRu: p.descriptionRu, descriptionEn: p.descriptionEn, category: p.category, year: p.year },
      create: { ...p, published: true },
    });
  }

  // Services
  const services = [
    { id: 'svc-1', titleRu: 'Гражданские дела', titleEn: 'Civil Cases', descriptionRu: 'Представительство в судах по гражданским делам: споры о собственности, договорные споры, взыскание долгов.', descriptionEn: 'Court representation in civil cases: property disputes, contract disputes, debt recovery.', iconName: 'gavel', sortOrder: 1 },
    { id: 'svc-2', titleRu: 'Корпоративное право', titleEn: 'Corporate Law', descriptionRu: 'Юридическое сопровождение бизнеса, регистрация компаний, корпоративные споры.', descriptionEn: 'Business legal support, company registration, corporate disputes.', iconName: 'briefcase', sortOrder: 2 },
    { id: 'svc-3', titleRu: 'Семейное право', titleEn: 'Family Law', descriptionRu: 'Разводы, раздел имущества, алименты, опека и попечительство.', descriptionEn: 'Divorces, property division, alimony, custody and guardianship.', iconName: 'users', sortOrder: 3 },
    { id: 'svc-4', titleRu: 'Защита прав потребителей', titleEn: 'Consumer Protection', descriptionRu: 'Возврат товаров, компенсация за некачественные услуги и товары.', descriptionEn: 'Product returns, compensation for defective services and goods.', iconName: 'shield', sortOrder: 4 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: { titleRu: s.titleRu, titleEn: s.titleEn, descriptionRu: s.descriptionRu, descriptionEn: s.descriptionEn, iconName: s.iconName, sortOrder: s.sortOrder },
      create: { ...s, published: true },
    });
  }

  // Articles
  const articles = [
    { id: 'art-1', slug: 'kak-zashitit-prava-potrebitelya', titleRu: 'Как защитить права потребителя', titleEn: 'How to Protect Consumer Rights', excerptRu: 'Подробное руководство по защите прав потребителей в России.', excerptEn: 'A detailed guide to consumer rights protection in Russia.', contentRu: '<p>Защита прав потребителей — одна из ключевых областей законодательства. Закон «О защите прав потребителей\u00bb даёт широкие возможности для возврата товаров и получения компенсаций.</p>', tags: '["\u043fотребители","\u043fрава"]' },
    { id: 'art-2', slug: 'nasledstvo-poryadok-oformleniya', titleRu: 'Наследство: порядок оформления', titleEn: 'Inheritance: Procedure', excerptRu: 'Как правильно оформить наследство и избежать споров.', excerptEn: 'How to properly process inheritance and avoid disputes.', contentRu: '<p>Наследование имущества — сложный юридический процесс. Важно соблюдать сроки и порядок обращения к нотариусу.</p>', tags: '["\u043dаследство"]' },
    { id: 'art-3', slug: 'trudovye-spory-chto-delat', titleRu: 'Трудовые споры: что делать?', titleEn: 'Labor Disputes: What to Do?', excerptRu: 'Рекомендации по защите трудовых прав.', excerptEn: 'Recommendations for labor rights protection.', contentRu: '<p>Если вас уволили незаконно или нарушили условия трудового договора, вы имеете право на защиту.</p>', tags: '["\u0442руд","\u0443вольнение"]' },
    { id: 'art-4', slug: 'dolevoe-stroitelstvo-riski', titleRu: 'Долевое строительство: риски и защита', titleEn: 'Shared Construction: Risks and Protection', excerptRu: 'Как защитить свои инвестиции в долевом строительстве.', excerptEn: 'How to protect your investments in shared construction.', contentRu: '<p>Долевое строительство связано с рисками. Федеральный закон №214-ФЗ защищает права дольщиков.</p>', tags: '["\u043dедвижимость","\u0434олевое"]' },
    { id: 'art-5', slug: 'korporativnye-spory-2024', titleRu: 'Корпоративные споры: тренды 2024', titleEn: 'Corporate Disputes: 2024 Trends', excerptRu: 'Обзор актуальных тенденций в корпоративном праве.', excerptEn: 'Review of current trends in corporate law.', contentRu: '<p>Корпоративные споры становятся всё более сложными в условиях современной экономики.</p>', tags: '["\u0431изнес","\u043aорпоративное"]' },
  ];

  for (const a of articles) {
    await prisma.article.upsert({
      where: { id: a.id },
      update: { titleRu: a.titleRu, titleEn: a.titleEn, excerptRu: a.excerptRu, excerptEn: a.excerptEn ?? '', contentRu: a.contentRu, tags: a.tags },
      create: { ...a, contentEn: '', excerptEn: a.excerptEn ?? '', published: true },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.\$disconnect());
