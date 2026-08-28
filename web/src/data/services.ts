/**
 * Services and prices.
 * Part 2 will move this into a Payload collection; prices below are
 * placeholders for the lawyer to adjust.
 */

export interface Service {
  id: string;
  title: string;
  icon: 'shield' | 'gavel' | 'scale' | 'family' | 'customs' | 'land' | 'briefcase' | 'contract';
  points: string[];
  priceFrom: number | null;
}

export const services: Service[] = [
  {
    id: 'criminal',
    title: 'Кримінальні справи',
    icon: 'shield',
    points: [
      'Захист на всіх стадіях кримінального провадження',
      'Захист прав обвинувачених та потерпілих',
      'Супровід свідків на допитах',
    ],
    priceFrom: 1000,
  },
  {
    id: 'customs',
    title: 'Митні справи та міграційні спори',
    icon: 'customs',
    points: [
      'Повернення вилучених транспортних засобів',
      'Оскарження митних рішень і штрафів',
      'Супровід переміщення товарів через кордон',
    ],
    priceFrom: 1000,
  },
  {
    id: 'administrative',
    title: 'Адміністративні справи',
    icon: 'gavel',
    points: [
      'Оскарження штрафів та постанов поліції',
      'Оскарження дій і бездіяльності держорганів',
      'Представництво в адміністративних судах',
    ],
    priceFrom: 1000,
  },
  {
    id: 'civil',
    title: 'Цивільні справи',
    icon: 'scale',
    points: [
      'Спадкові та договірні спори',
      'Стягнення боргу, відшкодування шкоди',
      'Захист прав споживачів',
    ],
    priceFrom: 1000,
  },
  {
    id: 'family',
    title: 'Сімейні справи',
    icon: 'family',
    points: [
      'Розлучення та поділ майна',
      'Аліменти та їх індексація',
      'Визначення місця проживання дитини',
    ],
    priceFrom: 1000,
  },
  {
    id: 'land',
    title: 'Земельні справи',
    icon: 'land',
    points: [
      'Визнання права власності на ділянку',
      'Встановлення сервітутів',
      'Поділ ділянки між власниками',
    ],
    priceFrom: 1000,
  },
  {
    id: 'business',
    title: 'Обслуговування бізнесу',
    icon: 'briefcase',
    points: [
      'Реєстрація та ліквідація підприємств',
      'Господарські спори, стягнення заборгованості',
      'Супровід перевірок органів контролю',
    ],
    priceFrom: 1000,
  },
  {
    id: 'labor',
    title: 'Трудові справи',
    icon: 'contract',
    points: [
      'Стягнення заборгованості по зарплаті',
      'Поновлення на роботі',
      'Консультації з трудових спорів',
    ],
    priceFrom: 1000,
  },
];

/** Additional practice areas shown as a compact list under the main grid. */
export const extraAreas = [
  'Міжнародні справи',
  'Кредитні спори',
  'Страхові справи',
  'Нерухомість',
  'Справи у сфері ІТ',
  'ДТП',
  'Соціальне забезпечення',
  'Екологічні справи',
  'Інтелектуальна власність',
  'ЄСПЛ — HUDOC',
] as const;
